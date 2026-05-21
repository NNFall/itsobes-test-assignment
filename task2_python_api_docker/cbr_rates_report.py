from __future__ import annotations

import argparse
import csv
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import requests


API_URL = "https://www.cbr-xml-daily.ru/daily_json.js"
DEFAULT_TOP_LIMIT = 10


class ApiError(Exception):
    """Raised when the external API cannot be fetched or parsed."""


@dataclass(frozen=True)
class CurrencyRate:
    code: str
    name: str
    nominal: int
    value: float
    previous: float

    @property
    def rub_per_unit(self) -> float:
        return self.value / self.nominal

    @property
    def previous_rub_per_unit(self) -> float:
        return self.previous / self.nominal

    @property
    def change_abs(self) -> float:
        return self.rub_per_unit - self.previous_rub_per_unit

    @property
    def change_percent(self) -> float:
        if self.previous_rub_per_unit == 0:
            return 0.0
        return self.change_abs / self.previous_rub_per_unit * 100

    def to_report_row(self) -> dict[str, Any]:
        return {
            "code": self.code,
            "name": self.name,
            "nominal": self.nominal,
            "rub_per_unit": round(self.rub_per_unit, 4),
            "previous_rub_per_unit": round(self.previous_rub_per_unit, 4),
            "change_abs": round(self.change_abs, 4),
            "change_percent": round(self.change_percent, 3),
        }


def fetch_rates(api_url: str = API_URL, timeout: int = 15) -> dict[str, Any]:
    try:
        response = requests.get(api_url, timeout=timeout)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ApiError(f"Не удалось получить данные API: {exc}") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        raise ApiError("API вернул ответ не в формате JSON.") from exc

    if not isinstance(payload, dict):
        raise ApiError("Некорректный формат API: ожидался JSON-объект.")

    return payload


def parse_currency_rates(payload: dict[str, Any]) -> list[CurrencyRate]:
    raw_rates = payload.get("Valute")
    if not isinstance(raw_rates, dict):
        raise ApiError("Некорректный формат API: отсутствует объект Valute.")

    rates: list[CurrencyRate] = []

    for code, item in raw_rates.items():
        if not isinstance(item, dict):
            raise ApiError(f"Некорректный формат валюты {code}: ожидался объект.")

        try:
            rates.append(
                CurrencyRate(
                    code=str(code),
                    name=str(item["Name"]),
                    nominal=int(item["Nominal"]),
                    value=float(item["Value"]),
                    previous=float(item["Previous"]),
                )
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise ApiError(f"Некорректные поля валюты {code}.") from exc

    return rates


def build_report(payload: dict[str, Any], top_limit: int) -> dict[str, Any]:
    rates = parse_currency_rates(payload)
    sorted_rates = sorted(rates, key=lambda rate: abs(rate.change_percent), reverse=True)
    top_rates = sorted_rates[:top_limit]

    return {
        "source": "cbr-xml-daily.ru",
        "date": payload.get("Date"),
        "previous_date": payload.get("PreviousDate"),
        "currency_count": len(rates),
        "top_by_absolute_percent_change": [
            rate.to_report_row() for rate in top_rates
        ],
    }


def print_report(report: dict[str, Any]) -> None:
    print("Отчет по курсам валют ЦБ РФ")
    print(f"Дата: {report.get('date')}")
    print(f"Предыдущая дата: {report.get('previous_date')}")
    print(f"Валют обработано: {report.get('currency_count')}")
    print()
    print("Топ изменений по модулю процента:")
    print(
        f"{'Код':<5} {'Курс, RUB':>12} {'Изм., RUB':>12} "
        f"{'Изм., %':>10} Название"
    )
    print("-" * 78)

    for row in report["top_by_absolute_percent_change"]:
        print(
            f"{row['code']:<5} "
            f"{row['rub_per_unit']:>12.4f} "
            f"{row['change_abs']:>12.4f} "
            f"{row['change_percent']:>10.3f} "
            f"{row['name']}"
        )


def save_report(report: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    suffix = output_path.suffix.lower()

    if suffix == ".json":
        output_path.write_text(
            json.dumps(report, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return

    if suffix == ".csv":
        rows = report["top_by_absolute_percent_change"]
        with output_path.open("w", newline="", encoding="utf-8-sig") as csv_file:
            writer = csv.DictWriter(
                csv_file,
                fieldnames=[
                    "code",
                    "name",
                    "nominal",
                    "rub_per_unit",
                    "previous_rub_per_unit",
                    "change_abs",
                    "change_percent",
                ],
            )
            writer.writeheader()
            writer.writerows(rows)
        return

    raise ApiError("Файл результата должен иметь расширение .json или .csv.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Получает курсы валют ЦБ РФ и выводит топ изменений.",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=DEFAULT_TOP_LIMIT,
        help=f"Сколько валют показать в отчете. По умолчанию: {DEFAULT_TOP_LIMIT}.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Путь для сохранения отчета в .json или .csv.",
    )
    parser.add_argument(
        "--api-url",
        default=API_URL,
        help="URL API. По умолчанию используется публичный JSON с курсами ЦБ РФ.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.top <= 0:
        print("Ошибка: --top должен быть положительным числом.", file=sys.stderr)
        return 2

    try:
        payload = fetch_rates(api_url=args.api_url)
        report = build_report(payload, top_limit=args.top)
        print_report(report)

        if args.output:
            save_report(report, args.output)
            print()
            print(f"Отчет сохранен: {args.output}")
    except ApiError as exc:
        print(f"Ошибка: {exc}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

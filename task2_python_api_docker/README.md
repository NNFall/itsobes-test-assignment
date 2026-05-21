# Задача 2. Python API + Docker

Скрипт получает JSON с курсами валют ЦБ РФ через публичный API `https://www.cbr-xml-daily.ru/daily_json.js`, обрабатывает данные и выводит топ валют с наибольшим изменением курса к предыдущему дню.

## Логика обработки

- Выполняется HTTP-запрос через `requests`.
- Проверяется HTTP-статус и корректность JSON.
- Из объекта `Valute` собирается нормализованный список валют.
- Для каждой валюты считается:
  - курс за 1 единицу валюты в рублях;
  - абсолютное изменение к предыдущему дню;
  - процентное изменение к предыдущему дню.
- Результат сортируется по модулю процентного изменения.

## Локальный запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python cbr_rates_report.py --top 10 --output examples/report.json
```

Сохранение в CSV:

```bash
python cbr_rates_report.py --top 10 --output examples/report.csv
```

## Запуск в Docker

```bash
docker build -t cbr-rates-report .
docker run --rm cbr-rates-report --top 10
docker run --rm -v ${PWD}/examples:/app/examples cbr-rates-report --top 10 --output examples/report.json
```

## Структура

```text
task2_python_api_docker/
  cbr_rates_report.py
  Dockerfile
  requirements.txt
  examples/
  README.md
```

## Оценка времени

Ориентировочно: 1.5 часа с учетом обработки ошибок, Dockerfile и примера результата.

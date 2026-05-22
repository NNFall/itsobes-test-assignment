# Статус Google Таблицы

Ссылка на таблицу:

```text
https://docs.google.com/spreadsheets/d/1kdPwyJNoY0iTCd0_MdIvStNLT5dNHc4ydRLRrwywBfE/edit?usp=sharing
```

## Что проверено

- Таблица открывается по ссылке.
- Название таблицы: `itsobes-test`.
- Лист `Лист1` доступен для просмотра/редактирования через веб-интерфейс.
- Меню `Расширения` открывается.
- Пункт `Apps Script` виден в меню.

## Финальный статус

- Лист `Rates` создан.
- Данные из API ЦБ РФ записаны в таблицу.
- В статусе таблицы указано: `Ежедневный триггер создан: примерно 09:00`.
- CSV-экспорт листа `Rates` успешно получен через публичную ссылку.

## Скриншоты

- `docs/google_sheet_check/sheet_public_open.png`
- `docs/google_sheet_check/04_extensions_menu.png`
- `docs/google_sheet_check/05_after_appscript_click.png`
- `docs/google_sheet_check/final_rates_sheet.png`

## Экспорт результата

CSV-экспорт сохранен в:

```text
docs/google_sheet_check/final_rates_export.csv
```

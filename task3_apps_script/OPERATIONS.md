# Журнал операций

## 2026-05-21

- Создана папка `task3_apps_script`.
- Выбран тот же API, что и во второй задаче: `https://www.cbr-xml-daily.ru/daily_json.js`.
- Создан файл `Code.gs` с функциями:
  - `onOpen`;
  - `refreshCbrRates`;
  - `createDailyRatesTrigger`;
  - вспомогательными функциями обработки и записи данных.
- Добавлен манифест `appsscript.json`.
- Добавлена инструкция по подключению к Google Таблице.

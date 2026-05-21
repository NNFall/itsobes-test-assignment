# Журнал операций

## 2026-05-21

- Создана папка `task2_python_api_docker`.
- Выбран API `https://www.cbr-xml-daily.ru/daily_json.js`, потому что он возвращает курсы ЦБ РФ в JSON без авторизации.
- Создан скрипт `cbr_rates_report.py`.
- Добавлена обработка:
  - HTTP-ошибок;
  - невалидного JSON;
  - неожиданной структуры ответа;
  - некорректных аргументов командной строки.
- Добавлены `requirements.txt`, `Dockerfile`, `README.md`.

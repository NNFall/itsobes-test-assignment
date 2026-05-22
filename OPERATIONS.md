# Общий журнал операций

## 2026-05-21

- Осмотрена рабочая папка `C:\Users\User\Desktop\work\itsobes`.
- Созданы папки:
  - `task1_web_utility`;
  - `task2_python_api_docker`;
  - `task3_apps_script`;
  - `docs`.
- Проверен внешний API `https://www.cbr-xml-daily.ru/daily_json.js`.
- API успешно вернул JSON с датами:
  - `Date`: `2026-05-22T11:30:00+03:00`;
  - `PreviousDate`: `2026-05-21T11:30:00+03:00`.

## Реализация

- Задача 1: реализована веб-утилита `IP Subnet Helper`.
- Задача 2: реализован Python-скрипт `cbr_rates_report.py`, Dockerfile и пример результата.
- Задача 3: реализован Apps Script `Code.gs` с меню, ручным запуском и созданием ежедневного триггера.

## Проверки

- `python -m py_compile cbr_rates_report.py` - успешно.
- `python cbr_rates_report.py --top 5 --output examples/report.json` - успешно.
- `node --check src/app.js` - успешно.
- Apps Script проверен как JavaScript через `node --check --input-type=commonjs` - успешно.
- Логика веб-утилиты проверена локальным Node-тестом через VM:
  - расчет `192.168.10.34/24`;
  - расчет `/31`;
  - VLSM-планирование для `10.10.0.0/22`.
- HTTP-доступ к веб-утилите через `http://127.0.0.1:8080` - успешно.
- Docker Desktop был запущен, после инициализации daemon сборка образа `cbr-rates-report` прошла успешно.
- Контейнер был запущен командой `docker run --rm cbr-rates-report --top 3`, скрипт успешно получил данные API и вывел отчет.
- Создан ZIP-архив `deliverables/itsobes_test_assignment.zip`.
- Архив проверен по списку файлов.
- SHA256 архива записан в `deliverables/itsobes_test_assignment.zip.sha256`.
- Добавлены служебные скрипты `scripts/run_checks.ps1` и `scripts/package.ps1`.
- Добавлена инструкция публикации на GitHub `docs/github_publish.md`.
- Добавлена инструкция деплоя веб-утилиты `docs/deploy_web_utility.md`.
- Добавлен черновик сообщения работодателю `docs/message_to_employer.md`.
- Создан скриншот веб-утилиты `docs/screenshots/task1_web_utility.png`.
- По результату скриншота доработана ширина таблицы планировщика подсетей.
- Добавлена серверная презентационная страница в `presentation_site`.
- Добавлен `docker-compose.yml` для запуска презентации через nginx на порту `8088`.
- Проект выгружен на сервер `5.129.236.90` в `/root/itsobes`.
- На сервере запущен контейнер `itsobes-presentation`.
- Внешние URL проверены:
  - `http://5.129.236.90:8088/`;
  - `http://5.129.236.90:8088/task1/`;
  - `http://5.129.236.90:8088/downloads/itsobes_test_assignment.zip`.
- Проект опубликован в GitHub: `https://github.com/NNFall/itsobes-test-assignment`.
- Выполнена браузерная проверка через Microsoft Edge headless/CDP.
- Результаты сохранены в `docs/manual_browser_test.md`, `docs/manual_test_results.json` и `docs/manual_test_screenshots/`.
- Проверена Google Таблица `https://docs.google.com/spreadsheets/d/1kdPwyJNoY0iTCd0_MdIvStNLT5dNHc4ydRLRrwywBfE/edit?usp=sharing`.
- В анонимной сессии таблица открывается, но Apps Script требует входа владельца/редактора в Google.
- Локальная git-ветка переименована в `main`.
- Скрипт `scripts/run_checks.ps1 -IncludeDocker` успешно выполнил проверки всех задач, включая Docker.

# Тестовое задание для собеседования

В репозитории подготовлены три обязательные задачи. Каждая задача лежит в отдельной папке.

## Структура

```text
itsobes/
  task1_web_utility/
    index.html
    src/
      app.js
      styles.css
    README.md
    AI_PROCESS.md
    OPERATIONS.md
  task2_python_api_docker/
    cbr_rates_report.py
    Dockerfile
    requirements.txt
    examples/
      report.json
      sample_output.txt
    README.md
    OPERATIONS.md
  task3_apps_script/
    Code.gs
    appsscript.json
    README.md
    OPERATIONS.md
  docs/
    final_submission.md
    final_checklist.md
    google_sheet_setup.md
  PLAN.md
  OPERATIONS.md
```

## Задача 1

Веб-утилита `IP Subnet Helper`: калькулятор IPv4/CIDR и VLSM-планировщик подсетей.

Запуск:

```bash
cd task1_web_utility
python -m http.server 8080
```

Открыть: `http://localhost:8080`

Можно также открыть `task1_web_utility/index.html` напрямую в браузере.

## Задача 2

Python-скрипт получает курсы валют ЦБ РФ через публичный JSON API, считает изменения к предыдущему дню и выводит отсортированный отчет.

Локальный запуск:

```bash
cd task2_python_api_docker
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python cbr_rates_report.py --top 10 --output examples/report.json
```

Docker:

```bash
cd task2_python_api_docker
docker build -t cbr-rates-report .
docker run --rm cbr-rates-report --top 10
```

## Задача 3

Apps Script для Google Таблицы получает те же курсы валют ЦБ РФ и записывает обработанные данные в лист `Rates`.

Подключение:

1. Создать Google Таблицу.
2. Открыть `Расширения -> Apps Script`.
3. Вставить код из `task3_apps_script/Code.gs`.
4. Сохранить проект и перезагрузить таблицу.
5. В меню `Курсы ЦБ` выбрать `Обновить курсы`.

## Что осталось перед финальной сдачей

- Создать Google Таблицу, вставить Apps Script и открыть доступ для просмотра.
- Добавить ссылку на Google Таблицу в `docs/final_submission.md`.
- ZIP-архив уже создан: `deliverables/itsobes_test_assignment.zip`.
- При необходимости создать GitHub-репозиторий.
- Docker-сборка и запуск контейнера проверены локально.

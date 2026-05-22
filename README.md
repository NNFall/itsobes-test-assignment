# Тестовое задание для собеседования

В репозитории подготовлены три обязательные задачи. Каждая задача лежит в отдельной папке.

Публичный GitHub-репозиторий: `https://github.com/NNFall/itsobes-test-assignment`.

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
    github_publish.md
    deploy_web_utility.md
    message_to_employer.md
    server_deployment.md
    manual_browser_test.md
    manual_test_results.json
    manual_test_screenshots/
    screenshots/
      task1_web_utility.png
  scripts/
    run_checks.ps1
    package.ps1
  presentation_site/
  docker-compose.yml
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
- При необходимости создать GitHub-репозиторий по инструкции `docs/github_publish.md`.
- Серверная презентация развернута: `http://5.129.236.90:8088/`.
- Docker-сборка и запуск контейнера проверены локально.

## Служебные команды

Проверка без Docker:

```powershell
.\scripts\run_checks.ps1
```

Проверка с Docker:

```powershell
.\scripts\run_checks.ps1 -IncludeDocker
```

Пересборка архива:

```powershell
.\scripts\package.ps1
```

## Серверная презентация

Проект можно поднять через Docker Compose:

```bash
docker compose up -d --build presentation
```

После запуска главная страница будет доступна на `http://<server-ip>:8088/`, веб-утилита - на `http://<server-ip>:8088/task1/`.

Браузерная проверка серверной версии описана в `docs/manual_browser_test.md`.

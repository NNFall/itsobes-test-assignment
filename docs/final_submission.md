# Финальный документ для сдачи

## Общая информация

Тестовое задание состоит из трех частей:

1. Веб-утилита HTML/CSS/JS.
2. Python-скрипт с внешним API и Docker.
3. Apps Script для Google Таблицы с внешним API.

Исходный код находится в текущем проекте. Для финальной сдачи можно приложить ZIP-архив или ссылку на GitHub/GitLab-репозиторий.

Инструкция для публикации на GitHub находится в `docs/github_publish.md`.

GitHub-репозиторий:

```text
https://github.com/NNFall/itsobes-test-assignment
```

Инструкция для деплоя веб-утилиты находится в `docs/deploy_web_utility.md`.

Локальный ZIP-архив для сдачи:

```text
deliverables/itsobes_test_assignment.zip
```

ZIP-архив на сервере:

```text
http://5.129.236.90:8088/downloads/itsobes_test_assignment.zip
```

Серверная презентационная страница:

```text
http://5.129.236.90:8088/
```

Рабочая веб-утилита:

```text
http://5.129.236.90:8088/task1/
```

SHA256 архива после сборки записан рядом с архивом:

```text
deliverables/itsobes_test_assignment.zip.sha256
```

## Задача 1. Веб-утилита

Название: `IP Subnet Helper`.

Назначение: калькулятор IPv4/CIDR и VLSM-планировщик подсетей для IT-специалиста.

Скриншот локальной проверки:

```text
docs/screenshots/task1_web_utility.png
```

Отчет браузерной проверки серверной версии:

```text
docs/manual_browser_test.md
```

Что реализовано:

- проверка IPv4/CIDR;
- расчет network, mask, wildcard, broadcast, диапазона хостов;
- расчет количества доступных адресов;
- классификация IP-адреса;
- планирование подсетей по требованиям вида `Office=120`;
- вывод ошибок в интерфейсе.

Файлы:

```text
task1_web_utility/
  index.html
  src/
    app.js
    styles.css
  README.md
  AI_PROCESS.md
  OPERATIONS.md
```

Запуск:

```bash
cd task1_web_utility
python -m http.server 8080
```

Открыть `http://localhost:8080`.

Описание работы с Claude Code/AI:

Для задачи была выбрана практическая веб-утилита для расчета IPv4-подсетей. Ключевые промпты:

```text
Сделай статическую веб-утилиту HTML/CSS/JS для расчета IPv4 CIDR: сеть, маска, wildcard, broadcast, диапазон хостов, количество доступных адресов. Код раздели по файлам.
```

```text
Добавь VLSM-планировщик: пользователь вводит базовую сеть и список требований вида Office=120, WiFi=60. Нужно отсортировать требования, подобрать префиксы и вывести таблицу подсетей.
```

```text
Проверь пограничные случаи /31 и /32, валидацию IPv4 и человекочитаемые ошибки.
```

AI помог с начальной структурой интерфейса и базовыми функциями. Вручную была уточнена логика расчета сетевого адреса через размер блока, чтобы не зависеть от знаковых битовых операций JavaScript. Также вручную доработана обработка ошибок, VLSM-выравнивание подсетей и оформление результата в таблицу.

Затраченное время: примерно 1.5-2 часа.

## Задача 2. Python-скрипт с внешним API + Docker

API: `https://www.cbr-xml-daily.ru/daily_json.js`.

Что реализовано:

- HTTP-запрос через `requests`;
- обработка JSON;
- проверка структуры ответа;
- расчет курса за 1 единицу валюты;
- расчет абсолютного и процентного изменения к предыдущему дню;
- сортировка валют по модулю процентного изменения;
- вывод в консоль;
- сохранение отчета в JSON или CSV;
- Dockerfile и `requirements.txt`.

Файлы:

```text
task2_python_api_docker/
  cbr_rates_report.py
  Dockerfile
  requirements.txt
  examples/
    report.json
    sample_output.txt
  README.md
  OPERATIONS.md
```

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

Пример вывода находится в `task2_python_api_docker/examples/sample_output.txt`.

Затраченное время: примерно 1.5 часа.

## Задача 3. Apps Script + внешний API в Google Таблице

API: `https://www.cbr-xml-daily.ru/daily_json.js`.

Что реализовано:

- пользовательское меню `Курсы ЦБ`;
- ручной запуск обновления через меню;
- функция создания ежедневного time-based триггера;
- HTTP-запрос через `UrlFetchApp.fetch`;
- парсинг JSON;
- расчет курса за 1 единицу валюты;
- расчет абсолютного и процентного изменения;
- сортировка по модулю процентного изменения;
- запись результата в лист `Rates`;
- запись статуса или ошибки в ячейку `I2`.

Файлы:

```text
task3_apps_script/
  Code.gs
  appsscript.json
  README.md
  OPERATIONS.md
```

Триггер:

- `onOpen` добавляет меню в таблицу;
- `refreshCbrRates` запускается вручную из меню;
- `createDailyRatesTrigger` создает ежедневный запуск примерно в 09:00.

Ссылка на Google Таблицу:

```text
https://docs.google.com/spreadsheets/d/1kdPwyJNoY0iTCd0_MdIvStNLT5dNHc4ydRLRrwywBfE/edit?usp=sharing
```

Статус подключения Apps Script:

```text
Код Apps Script готов. Для подключения скрипта к таблице нужен вход владельца/редактора в Google-аккаунт.
```

Затраченное время: примерно 1-1.5 часа.

## Проверки

- Python-компиляция скрипта прошла успешно.
- Реальный запуск Python-скрипта с API прошел успешно.
- JavaScript веб-утилиты прошел синтаксическую проверку.
- Apps Script прошел синтаксическую проверку как JavaScript.
- Веб-утилита была доступна локально через `http://127.0.0.1:8080`.
- Dockerfile проверен: образ `cbr-rates-report` собран, контейнер успешно запущен с параметром `--top 3`.

## Что нужно добавить перед отправкой

- Ссылку на GitHub/GitLab-репозиторий или ZIP-архив.
- Ссылку на Google Таблицу с открытым доступом для просмотра.
- При наличии деплоя веб-утилиты: ссылку на GitHub Pages, Netlify или другой хостинг.

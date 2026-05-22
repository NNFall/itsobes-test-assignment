# Ручная браузерная проверка

Дата проверки: 2026-05-22.

Проверялся серверный стенд:

```text
http://5.129.236.90:8088/
```

Проверка выполнена в Microsoft Edge headless через Chrome DevTools Protocol. Скрипт проверки: `scripts/browser_smoke_test.mjs`.

## Карта проверок

| Шаг | Что проверялось | Результат |
| --- | --- | --- |
| 1 | Открывается главная презентационная страница | OK |
| 2 | На главной есть ссылка `Открыть веб-утилиту` | OK |
| 3 | Клик по ссылке открывает `/task1/` | OK |
| 4 | Дефолтный CIDR `192.168.10.34/24` считает сеть `192.168.10.0` | OK |
| 5 | Дефолтный VLSM-планировщик выводит 4 строки | OK |
| 6 | Пользовательский CIDR `172.16.5.77/20` считает сеть `172.16.0.0` | OK |
| 7 | Пользовательский CIDR считает broadcast `172.16.15.255` | OK |
| 8 | Адрес `172.16.5.77` классифицируется как `Private RFC1918` | OK |
| 9 | Пользовательский план `10.20.0.0/24` + `Users/Cameras/VPN` выводит 3 подсети | OK |
| 10 | Первая подсеть плана: `10.20.0.0/26` | OK |
| 11 | Ошибки планировщика при корректном вводе не отображаются | OK |
| 12 | Некорректный CIDR `999.1.1.1/24` показывает понятную ошибку | OK |
| 13 | Финальный документ доступен с сервера | OK |
| 14 | Код Apps Script доступен с сервера и содержит `UrlFetchApp.fetch` | OK |
| 15 | Код Apps Script содержит функцию создания триггера `createDailyRatesTrigger` | OK |
| 16 | SHA256-файл ZIP-архива доступен с сервера | OK |

Полный JSON-результат: `docs/manual_test_results.json`.

## Скриншоты

- `docs/manual_test_screenshots/01_presentation_home.png`
- `docs/manual_test_screenshots/02_task1_default.png`
- `docs/manual_test_screenshots/03_task1_cidr_custom.png`
- `docs/manual_test_screenshots/04_task1_planner_custom.png`
- `docs/manual_test_screenshots/05_task1_invalid_cidr.png`
- `docs/manual_test_screenshots/06_final_submission.png`
- `docs/manual_test_screenshots/07_apps_script_code.png`

## Вывод

Серверная презентация открывается извне, веб-утилита выполняет основную логику расчета CIDR и VLSM, ошибки валидации отображаются корректно. Материалы для задач 2 и 3 доступны через серверную страницу и архив.

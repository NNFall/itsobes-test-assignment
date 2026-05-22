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

## Ограничение

В анонимной браузерной сессии пункт `Apps Script` не открыл редактор скриптов. Для подключения `Code.gs` нужен вход в Google-аккаунт владельца или редактора таблицы.

Пароль от Google передавать не нужно. Безопасный вариант: владелец таблицы входит в аккаунт сам, открывает Apps Script и вставляет код из `task3_apps_script/Code.gs`, либо открывает браузерную сессию и вводит авторизацию самостоятельно.

## Скриншоты

- `docs/google_sheet_check/sheet_public_open.png`
- `docs/google_sheet_check/04_extensions_menu.png`
- `docs/google_sheet_check/05_after_appscript_click.png`

## Что осталось сделать

1. Открыть таблицу под Google-аккаунтом владельца/редактора.
2. Открыть `Расширения -> Apps Script`.
3. Вставить код из `task3_apps_script/Code.gs`.
4. Сохранить проект.
5. Запустить `refreshCbrRates`.
6. Подтвердить разрешения Apps Script.
7. Вернуться в таблицу и проверить лист `Rates`.

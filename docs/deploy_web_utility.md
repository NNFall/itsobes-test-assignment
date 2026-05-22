# Деплой веб-утилиты

Веб-утилита из задачи 1 является статическим сайтом, поэтому ее можно развернуть на GitHub Pages, Netlify или Vercel.

## GitHub Pages

После публикации репозитория `NNFall/itsobes-test-assignment`:

1. Открыть репозиторий на GitHub.
2. Перейти в `Settings -> Pages`.
3. В разделе `Build and deployment` выбрать `Deploy from a branch`.
4. Выбрать ветку `main` и папку `/root`.
5. Сохранить настройки.

Ожидаемый URL веб-утилиты:

```text
https://nnfall.github.io/itsobes-test-assignment/task1_web_utility/
```

Эту ссылку нужно вставить в `docs/final_submission.md`.

## Локальная проверка перед деплоем

```bash
cd task1_web_utility
python -m http.server 8080
```

Открыть:

```text
http://localhost:8080
```

## Текущий серверный вариант

Для этого проекта подготовлен Docker Compose на порту `8088`:

```bash
docker compose up -d --build presentation
```

После запуска:

```text
http://5.129.236.90:8088/
http://5.129.236.90:8088/task1/
```

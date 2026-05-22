# Серверная выкладка

Проект выгружен на сервер:

```text
5.129.236.90
/root/itsobes
```

Docker Compose поднимает презентационную страницу через nginx на порту `8088`.

## Ссылки

Главная страница:

```text
http://5.129.236.90:8088/
```

Веб-утилита из задачи 1:

```text
http://5.129.236.90:8088/task1/
```

ZIP-архив:

```text
http://5.129.236.90:8088/downloads/itsobes_test_assignment.zip
```

Финальный документ:

```text
http://5.129.236.90:8088/docs/final_submission.md
```

## Команды на сервере

```bash
cd /root/itsobes
docker compose up -d --build presentation
docker compose --profile tools run --rm cbr-report --top 3
docker compose ps
```

## Проверено

- `docker compose up -d --build presentation` успешно собрал и запустил nginx-контейнер.
- `docker compose --profile tools run --rm cbr-report --top 3` успешно собрал и запустил Python-скрипт в Docker.
- `curl http://127.0.0.1:8088/` на сервере возвращает HTML.
- Внешняя проверка с локальной машины по `http://5.129.236.90:8088/` возвращает HTTP 200.

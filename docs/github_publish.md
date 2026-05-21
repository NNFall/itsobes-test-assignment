# Публикация на GitHub

GitHub-коннектор в Codex видит аккаунт `NNFall`, но создание нового репозитория удобнее выполнить через GitHub CLI.

## Вариант с новым публичным репозиторием

```bash
gh auth login
git branch -M main
gh repo create NNFall/itsobes-test-assignment --public --source . --remote origin --push
```

После публикации ссылка на репозиторий будет:

```text
https://github.com/NNFall/itsobes-test-assignment
```

Эту ссылку нужно вставить в `docs/final_submission.md`.

## Вариант с приватным репозиторием

```bash
gh auth login
git branch -M main
gh repo create NNFall/itsobes-test-assignment --private --source . --remote origin --push
```

В этом случае проверяющему нужно будет выдать доступ к репозиторию.

## Если репозиторий уже создан вручную

```bash
git remote add origin https://github.com/NNFall/itsobes-test-assignment.git
git branch -M main
git push -u origin main
```

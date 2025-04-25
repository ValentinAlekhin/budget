# Приложение для управления бюджетом

Полноценное веб-приложение для управления личным бюджетом, построенное на Nuxt.js и Go.

## Структура проекта

```
.
├── client/          # Frontend приложение на Nuxt.js
├── server/          # Backend приложение на Go
├── api/             # Спецификации и документация API
├── docker/          # Конфигурационные файлы Docker
└── docker-compose.yml
```

## Требования

- Node.js (v18 или выше)
- Go (v1.21 или выше)
- Docker и Docker Compose
- pnpm (менеджер пакетов)

## Начало работы

### Настройка окружения разработки

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd budget
```

2. Запустите окружение разработки:

```bash
docker-compose up -d
```

3. Доступ к приложениям:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### Локальная разработка

#### Frontend (client)

```bash
cd client
pnpm install
pnpm dev
```

#### Backend (server)

```bash
cd server
go mod download
go run main.go
```

## Возможности

- Аутентификация и авторизация пользователей
- Отслеживание и управление бюджетом
- История транзакций
- Управление категориями
- Отчеты и аналитика

## Технологический стек

### Frontend

- Nuxt.js 3
- Vue.js 3
- TypeScript
- Pinia (Управление состоянием)
- Tailwind CSS

### Backend

- Go
- PostgreSQL
- Redis
- Docker

## Участие в разработке

1. Сделайте форк репозитория
2. Создайте ветку для вашей функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Добавлена новая функция'`)
4. Отправьте изменения в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## Лицензия

Этот проект распространяется под лицензией MIT - подробности в файле LICENSE.

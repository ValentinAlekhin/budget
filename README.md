# Budget Application

A full-stack web application for budget management built with Nuxt.js and Go.

## Project Structure

```
.
├── client/          # Nuxt.js frontend application
├── server/          # Go backend application
├── api/             # API specifications and documentation
├── docker/          # Docker configuration files
└── docker-compose.yml
```

## Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)
- Docker and Docker Compose
- pnpm (package manager)

## Getting Started

### Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd budget
```

2. Start the development environment:

```bash
docker-compose up -d
```

3. Access the applications:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### Local Development

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

## Features

- User authentication and authorization
- Budget tracking and management
- Transaction history
- Category management
- Reports and analytics

## Technology Stack

### Frontend

- Nuxt.js 3
- Vue.js 3
- TypeScript
- Pinia (State Management)
- Tailwind CSS

### Backend

- Go
- PostgreSQL
- Redis
- Docker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

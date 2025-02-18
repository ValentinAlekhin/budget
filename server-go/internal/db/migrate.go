package db

import (
	"budget/internal/config"
	"database/sql"
	"embed"
	"errors"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/lib/pq"
)

//go:embed migrations/*
var migrationsFs embed.FS

func RunMigrations(dbConfig *config.DB) {
	// Подключение к базе данных
	db, err := sql.Open("postgres", dbConfig.GetUrl())
	if err != nil {
		log.Fatalf("failed to connect to the database: %v", err)
	}
	defer func() {
		if closeErr := db.Close(); closeErr != nil {
			log.Printf("failed to close the database connection: %v", closeErr)
		}
	}()

	// Создание драйвера миграций для PostgreSQL
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("failed to create PostgreSQL migration driver: %v", err)
	}

	// Использование iofs для работы с встроенными файлами
	sourceDriver, err := iofs.New(migrationsFs, "migrations")
	if err != nil {
		log.Fatalf("failed to create source driver for embedded migrations: %v", err)
	}

	// Инициализация миграций
	m, err := migrate.NewWithInstance(
		"iofs",        // Тип источника (iofs для embed.FS)
		sourceDriver,  // Драйвер для встроенных файлов
		dbConfig.Name, // Имя базы данных
		driver,        // Драйвер базы данных
	)
	if err != nil {
		log.Fatalf("failed to initialize migrations: %v", err)
	}

	// Применение миграций
	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatalf("failed to apply migrations: %v", err)
	}

	// Если миграции уже применены
	if errors.Is(err, migrate.ErrNoChange) {
		log.Println("no new migrations to apply")
	} else {
		log.Println("migrations applied successfully")
	}
}

package db

import (
	"budget/internal/config"
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/lib/pq"
)

//go:embed migrations/*
var migrationsFs embed.FS

// RunMigrations выполняет миграции базы данных.
func RunMigrations(dbConfig *config.DB) error {
	db, err := sql.Open("postgres", dbConfig.GetUrl())
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %w", err)
	}
	defer func() {
		if closeErr := db.Close(); closeErr != nil {
			log.Printf("failed to close the database connection: %v", closeErr)
		}
	}()

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create PostgreSQL migration driver: %w", err)
	}

	sourceDriver, err := iofs.New(migrationsFs, "migrations")
	if err != nil {
		return fmt.Errorf("failed to create source driver for embedded migrations: %w", err)
	}

	m, err := migrate.NewWithInstance(
		"iofs",
		sourceDriver,
		dbConfig.Name,
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to initialize migrations: %w", err)
	}

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	if errors.Is(err, migrate.ErrNoChange) {
		log.Println("no new migrations to apply")
	} else {
		log.Println("migrations applied successfully")
	}

	return nil
}

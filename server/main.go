package main

import (
	"budget/internal/config"
	"budget/internal/db"
	"budget/internal/router"
	"budget/internal/telegram"
	"budget/internal/ws"
	"budget/pkg/logger"
	"context"
	"fmt"
	"log"
	"os"
)

func main() {
	log2, err := logger.New()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	dbConfig, serverConfig, jwtConfig, telegramConfig, err := config.GetAll()
	if err != nil {
		log.Fatalf("failed to load configurations: %v", err)
	}

	err = db.RunMigrations(dbConfig)
	if err != nil {
		log.Fatalf("failed to run database migrations: %v", err)
	}

	connection, err := db.CreateConnection(context.Background(), dbConfig.GetConnectionString())
	if err != nil {
		log.Fatalf("failed to establish database connection: %v", err)
	}

	if telegramConfig.Enable {
		err = telegram.NewBot(telegramConfig, dbConfig)
		if err != nil {
			log.Fatalf("failed to start telegram bot: %v", err)
		}
	}

	go ws.Manager.Start()

	err = router.Init(connection, jwtConfig, serverConfig)
	if err != nil {
		log.Fatalf("failed to initialize router: %v", err)
	}

	log2.Info("Application started successfully", map[string]interface{}{"port": 8000})
}

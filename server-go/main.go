package main

import (
	"budget/internal/config"
	db "budget/internal/db"
	"budget/internal/router"
	"budget/internal/ws"
	"context"
	"log"
)

func main() {
	dbConfig, serverConfig, jwtConfig, _, err := config.GetAll()
	if err != nil {
		log.Fatalf("failed to load configurations: %v", err)
	}

	err = db.RunMigrations(dbConfig)
	if err != nil {
		log.Fatalf("failed to run database migrations: %v", err)
	}

	go ws.Manager.Start()

	//go telegram.Bot.Init()

	connection, err := db.CreateConnection(context.Background(), dbConfig.GetConnectionString())
	if err != nil {
		log.Fatalf("failed to establish database connection: %v", err)
	}

	err = router.Init(connection, jwtConfig, serverConfig)
	if err != nil {
		log.Fatalf("failed to initialize router: %v", err)
	}

	log.Println("Application started successfully")
}

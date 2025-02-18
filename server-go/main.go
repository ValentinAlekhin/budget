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
		log.Fatal(err)
	}

	db.RunMigrations(dbConfig)

	go ws.Manager.Start()
	//go telegram.Bot.Init()
	connection, err := db.CreateConnection(context.Background(), dbConfig.GetConnectionString())
	if err != nil {
		log.Fatal(err)
	}
	err = router.Init(connection, jwtConfig, serverConfig)
	if err != nil {
		log.Fatal(err)
	}
}

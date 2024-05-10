package main

import (
	"budget/internal/ws"
	"budget/router"
)

func main() {
	go ws.Manager.Start()
	//go telegram.Bot.Init()
	router.Init()
}

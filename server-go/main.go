package main

import (
	"budget/internal/ws"
	"budget/router"
)

func main() {
	go ws.Manager.Start()
	router.Init()
}

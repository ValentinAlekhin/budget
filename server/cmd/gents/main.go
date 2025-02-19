package main

import (
	"budget/internal/gents"
	"log"
)

func main() {
	err := gents.Run("../client/dto/index.ts")
	if err != nil {
		log.Fatal(err)
	}
}

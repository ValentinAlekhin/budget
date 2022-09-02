package category

import (
	db "budget/database"
	"budget/internal/record"
)

type Category struct {
	db.Model
	Name    string          `json:"name"`
	Type    string          `json:"type"`
	Comment string          `json:"comment"`
	UserID  uint            `json:"userId"`
	Records []record.Record `json:"records"`
}

func init() {
	if err := db.Instance.AutoMigrate(&Category{}); err != nil {
		panic(err)
	}
}

package user

import (
	db "budget/database"
	"budget/internal/category"
)

type User struct {
	db.Model
	Username   string              `json:"username"`
	Email      string              `json:"email"`
	Password   string              `json:"password,omitempty"`
	Categories []category.Category `json:"categories"`
}

func init() {
	if err := db.Instance.AutoMigrate(&User{}); err != nil {
		panic(err)
	}
}

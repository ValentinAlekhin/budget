package user

import (
	db "budget/database"
)

type User struct {
	db.Model
	Username   string              `json:"username"`
	Email      string              `json:"email"`
	Password   string              `json:"password,omitempty"`
	// Categories []category.Category `json:"categories"`
}

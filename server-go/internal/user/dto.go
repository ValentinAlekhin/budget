package user

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type CreateUserDto struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type EmailValidationRequestDto struct {
	Email string `json:"email" binding:"required,email"`
}

type UsernameValidationRequestDto struct {
	Username string `json:"username" binding:"required"`
}

type ValidationResponseDto struct {
	Valid bool `json:"valid"`
}

type ResponseDto struct {
	ID        int32            `json:"id"`
	CreatedAt pgtype.Timestamp `json:"createdAt"`
	UpdatedAt pgtype.Timestamp `json:"updatedAt"`
	Username  string           `json:"username"`
	Email     string           `json:"email"`
	Password  string           `json:"password"`
	DeletedAt pgtype.Timestamp `json:"deletedAt"`
}

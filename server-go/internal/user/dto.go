package user

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

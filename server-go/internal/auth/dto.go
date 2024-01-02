package auth

type LoginRequestDto struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponseDto struct {
	AccessToken string `json:"accessToken"`
}

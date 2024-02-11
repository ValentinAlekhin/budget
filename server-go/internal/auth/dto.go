package auth

type LoginRequestDto struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type PureUserDto struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type LoginResponseDto struct {
	User         PureUserDto
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type RefreshTokenDto struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

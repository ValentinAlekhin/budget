package auth

type LoginRequestDto struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type PureUserDto struct {
	ID       int32  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type LoginResponseDto struct {
	User         PureUserDto `json:"user"`
	AccessToken  string      `json:"accessToken"`
	RefreshToken string      `json:"refreshToken"`
}

type RefreshTokenRequestDto struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type RefreshTokenResponseDto struct {
	RefreshToken string `json:"refreshToken"`
	AccessToken  string `json:"accessToken"`
}

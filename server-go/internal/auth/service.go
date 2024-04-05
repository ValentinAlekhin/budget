package auth

import (
	"budget/config"
	db "budget/database"
	"budget/internal/user"
	"budget/utils/argon"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type service struct {
}

type CustomClaims struct {
	jwt.RegisteredClaims
	User PureUserDto
}

func (s service) Login(dto *LoginRequestDto) (LoginResponseDto, error) {
	targetUser, err := user.Service.GetUserByEmailAndPass(dto.Username, dto.Password)
	if err != nil {
		return LoginResponseDto{}, err
	}

	pureUser := PureUserDto{targetUser.ID, targetUser.Username, targetUser.Email}

	accessToken, refreshToken, err := s.getTokens(pureUser)
	if err != nil {
		return LoginResponseDto{}, err
	}

	return LoginResponseDto{pureUser, accessToken, refreshToken}, nil
}

func (s service) getTokens(user PureUserDto) (string, string, error) {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 5)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		User: user,
	})

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 30)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		User: user,
	})

	accessTokenSrt, err := accessToken.SignedString([]byte(config.JWT.AccessTokenSecret))
	if err != nil {
		return "", "", err
	}

	refreshTokenSrt, err := refreshToken.SignedString([]byte(config.JWT.RefreshTokenSecret))
	if err != nil {
		return "", "", err
	}

	if err := s.saveRefreshToken(refreshTokenSrt, user.ID); err != nil {
		return "", "", err
	}

	return accessTokenSrt, refreshTokenSrt, nil
}

func (s service) saveRefreshToken(token string, userId string) error {
	tokenHash, err := argon.NewArgon2ID().Hash(token)
	if err != nil {
		return err
	}

	tokenEntity := db.RefreshToken{
		RefreshToken: tokenHash,
		ExpiresAt:    time.Time{},
		UserId:       userId,
	}

	if res := db.Instance.Create(&tokenEntity); res.Error != nil {
		return errors.New("save token http-error")
	}

	return nil
}

func (s service) ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWT.AccessTokenSecret), nil
	})
	if err != nil {
		return &CustomClaims{}, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return &CustomClaims{}, errors.New("invalid token")
}

func (s service) Logout() error {
	return nil
}

var Service = service{}

package auth

import (
	"budget/config"
	"budget/internal/user"
	"errors"
	"github.com/golang-jwt/jwt/v4"
	"time"
)

type service struct {
}

type CustomClaims struct {
	jwt.RegisteredClaims
	user.User
}

func (s service) Login(dto *LoginRequestDto) (LoginResponseDto, error) {
	targetUser, err := user.Service.GetUserByEmailAndPass(dto.Email, dto.Password)
	if err != nil {
		return LoginResponseDto{}, err
	}

	token, err := s.getToken(targetUser)
	if err != nil {
		return LoginResponseDto{}, err
	}

	return LoginResponseDto{AccessToken: token}, nil
}

func (s service) getToken(user user.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		User: user,
	})

	tokenSrt, err := token.SignedString([]byte(config.JWT.Secret))
	if err != nil {
		return "", err
	}

	return tokenSrt, nil
}

func (s service) ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWT.Secret), nil
	})
	if err != nil {
		return &CustomClaims{}, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return &CustomClaims{}, errors.New("invalid token")
}

func (s service) Logout(id string) error {
	return nil
}

var Service = service{}

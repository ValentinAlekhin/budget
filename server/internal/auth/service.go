package auth

import (
	"budget/internal/config"
	"budget/internal/db/sqlc/budget"
	http_error "budget/internal/http-error"
	refresh_token "budget/internal/refresh-token"
	"budget/internal/user"
	"budget/pkg/utils/argon"
	"context"
	"errors"
	"github.com/golang-module/carbon/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Service struct {
	userService *user.Service
	tokenRepo   *refresh_token.Repo
	jwtConfig   *config.JWT
}

func NewService(db *pgxpool.Pool, jwtConfig *config.JWT) *Service {
	userService := user.NewService(db)
	tokenRepo := refresh_token.NewRepo(db)
	return &Service{userService: userService, tokenRepo: tokenRepo, jwtConfig: jwtConfig}
}

type CustomClaims struct {
	jwt.RegisteredClaims
	User PureUserDto
}

func (s Service) Login(dto *LoginRequestDto) (LoginResponseDto, error) {
	targetUser, err := s.userService.GetUserByEmailAndPass(dto.Username, dto.Password)
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

func (s Service) getTokens(user PureUserDto) (string, string, error) {
	accessTokenExpiresAt := time.Now().Add(time.Minute * time.Duration(s.jwtConfig.AccessTokenExpiration))
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessTokenExpiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		User: user,
	})

	refreshTokenExpiresAt := time.Now().Add(time.Minute * time.Duration(s.jwtConfig.RefreshTokenExpiration))
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshTokenExpiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		User: user,
	})

	accessTokenSrt, err := accessToken.SignedString([]byte(s.jwtConfig.AccessTokenSecret))
	if err != nil {
		return "", "", err
	}

	refreshTokenSrt, err := refreshToken.SignedString([]byte(s.jwtConfig.RefreshTokenSecret))
	if err != nil {
		return "", "", err
	}

	if err := s.saveRefreshToken(refreshTokenSrt, user.ID); err != nil {
		return "", "", err
	}

	return accessTokenSrt, refreshTokenSrt, nil
}

func (s Service) saveRefreshToken(token string, userId int32) error {
	tokenHash, err := argon.NewArgon2ID().Hash(token)
	if err != nil {
		return err
	}

	tokenEntity := budget.CreateRefreshTokenParams{
		RefreshToken: tokenHash,
		ExpiresAt: pgtype.Timestamp{
			Time:  carbon.Now().AddDays(30).StdTime(),
			Valid: true,
		},
		UserID: userId,
	}

	ctx := context.Background()
	_, err = s.tokenRepo.Create(ctx, tokenEntity)
	if err != nil {
		return errors.New("save token http-error")
	}

	return nil
}

func (s Service) ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.jwtConfig.AccessTokenSecret), nil
	})
	if err != nil {
		return &CustomClaims{}, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return &CustomClaims{}, errors.New("invalid token")
}

func (s Service) Logout() error {
	return nil
}

func (s Service) RefreshTokens(dto RefreshTokenRequestDto) (RefreshTokenResponseDto, error) {
	claims, err := s.ParseToken(dto.RefreshToken)
	if err != nil {
		return RefreshTokenResponseDto{}, http_error.NewBadRequestError("Invalid token", "")
	}

	tokenEntity, err := s.validateRefreshToken(claims, dto.RefreshToken)
	if err != nil {
		return RefreshTokenResponseDto{}, http_error.NewBadRequestError("Invalid token", "")
	}

	ctx := context.Background()
	err = s.tokenRepo.Delete(ctx, tokenEntity.ID)
	if err != nil {
		return RefreshTokenResponseDto{}, http_error.NewInternalRequestError("Remove token error")
	}

	accessToken, refreshToken, err := s.getTokens(claims.User)
	if err != nil {
		return RefreshTokenResponseDto{}, http_error.NewInternalRequestError("Get tokens error")
	}

	return RefreshTokenResponseDto{
		RefreshToken: refreshToken,
		AccessToken:  accessToken,
	}, nil
}

func (s Service) validateRefreshToken(claims *CustomClaims, token string) (refresh_token.ResponseDto, error) {
	ctx := context.Background()
	tokens, err := s.tokenRepo.ListByUser(ctx, claims.User.ID)
	if err != nil {
		return refresh_token.ResponseDto{}, errors.New("no tokens")
	}

	for _, tokenEntity := range tokens {
		if isValid, _ := argon.NewArgon2ID().Verify(token, tokenEntity.RefreshToken); isValid {
			return tokenEntity, nil
		}
	}

	return refresh_token.ResponseDto{}, errors.New("no tokens")
}

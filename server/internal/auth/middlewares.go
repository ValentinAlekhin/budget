package auth

import (
	"budget/internal/config"
	http_error "budget/internal/http-error"
	"budget/internal/user"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"strings"
)

type Middlewares struct {
	userService *user.Service
	authService *Service
	jwtConfig   *config.JWT
}

func NewMiddlewares(db *pgxpool.Pool, jwtConfig *config.JWT) *Middlewares {
	userService := user.NewService(db)
	authService := NewService(db, jwtConfig)
	return &Middlewares{userService, authService, jwtConfig}
}

func (m Middlewares) AuthRequired(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")

	headerError := http_error.NewUnauthorizedError("No authorization header")

	if authHeader == "" {
		ctx.Error(headerError)
		ctx.Abort()
		return
	}

	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		ctx.Error(headerError)
		ctx.Abort()
		return
	}

	if headerParts[0] != "Bearer" {
		ctx.Error(headerError)
		ctx.Abort()
		return
	}

	claims, err := m.authService.ParseToken(headerParts[1], m.jwtConfig.AccessTokenSecret)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("Token expired"))
		ctx.Abort()
		return
	}

	targetUser, err := m.userService.GetUserById(claims.User.ID)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("User not found"))
		ctx.Abort()
		return
	}

	pureUser := PureUserDto{targetUser.ID, targetUser.Username, targetUser.Email}

	ctx.Set("user", pureUser)
	ctx.Set("userId", pureUser.ID)
}

func (m Middlewares) AuthRequiredCookie(ctx *gin.Context) {
	cookie, err := ctx.Cookie("token")

	cookieError := http_error.NewUnauthorizedError("No authorization cookie")
	if err != nil {
		ctx.Error(cookieError)
		ctx.Abort()
		return
	}

	if cookie == "" {
		ctx.Error(cookieError)
		ctx.Abort()
		return
	}

	claims, err := m.authService.ParseToken(cookie, m.jwtConfig.AccessTokenSecret)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("Token expired"))
		ctx.Abort()
		return
	}

	targetUser, err := m.userService.GetUserById(claims.User.ID)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("User not found"))
		ctx.Abort()
		return
	}

	pureUser := PureUserDto{targetUser.ID, targetUser.Username, targetUser.Email}

	ctx.Set("user", pureUser)
	ctx.Set("userId", pureUser.ID)
}

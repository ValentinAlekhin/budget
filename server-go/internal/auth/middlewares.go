package auth

import (
	http_error "budget/internal/http-error"
	"budget/internal/user"
	"github.com/gin-gonic/gin"
	"strings"
)

type middlewares struct {
}

func (m middlewares) AuthRequired(ctx *gin.Context) {
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

	claims, err := Service.ParseToken(headerParts[1])
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("Token expired"))
		ctx.Abort()
		return
	}

	targetUser, err := user.Service.GetUserById(claims.User.ID)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("User not found"))
		ctx.Abort()
		return
	}

	pureUser := PureUserDto{targetUser.ID, targetUser.Username, targetUser.Email}

	ctx.Set("user", pureUser)
	ctx.Set("userId", pureUser.ID)
}

func (m middlewares) AuthRequiredCookie(ctx *gin.Context) {
	cookie, err := ctx.Cookie("token")

	cookieError := http_error.NewUnauthorizedError("No authorization header")
	if err != nil {
		ctx.Error(cookieError)
		return
	}

	if cookie == "" {
		ctx.Error(cookieError)
		return
	}

	claims, err := Service.ParseToken(cookie)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("Token expired"))
		return
	}

	targetUser, err := user.Service.GetUserById(claims.User.ID)
	if err != nil {
		ctx.Error(http_error.NewUnauthorizedError("User not found"))
		return
	}

	pureUser := PureUserDto{targetUser.ID, targetUser.Username, targetUser.Email}

	ctx.Set("user", pureUser)
	ctx.Set("userId", pureUser.ID)
}

var Middlewares = middlewares{}

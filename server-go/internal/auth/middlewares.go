package auth

import (
	"budget/internal/user"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type middlewares struct {
}

func (m middlewares) AuthRequired(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if headerParts[0] != "Bearer" {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims, err := Service.ParseToken(headerParts[1])
	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	targetUser, err := user.Service.GetUserById(claims.User.ID)
	targetUser.Password = ""
	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	ctx.Set("user", targetUser)
	ctx.Set("userId", targetUser.ID)
}

var Middlewares = middlewares{}

package auth

import (
	"budget/internal/user"
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) Login(ctx *gin.Context) {
	var loginDto LoginRequestDto

	if err := ctx.ShouldBindJSON(&loginDto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := Service.Login(&loginDto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c controller) Me(ctx *gin.Context) {
	targetUser := ctx.MustGet("user").(user.User)
	ctx.JSON(http.StatusOK, targetUser)
}

func (c controller) Logout(ctx *gin.Context) {

}

var Controller = controller{}

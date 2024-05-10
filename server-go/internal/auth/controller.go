package auth

import (
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) Login(ctx *gin.Context) {
	var loginDto LoginRequestDto

	if err := ctx.ShouldBindJSON(&loginDto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	res, err := Service.Login(&loginDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c controller) Me(ctx *gin.Context) {
	targetUser := ctx.MustGet("user").(PureUserDto)
	ctx.JSON(http.StatusOK, targetUser)
}

func (c controller) Logout(ctx *gin.Context) {

}

func (c controller) RefreshTokens(ctx *gin.Context) {
	var refreshTokenDto RefreshTokenRequestDto
	if err := ctx.ShouldBindJSON(&refreshTokenDto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	response, err := Service.RefreshTokens(refreshTokenDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}

var Controller = controller{}

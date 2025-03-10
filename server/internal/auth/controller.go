package auth

import (
	"budget/internal/config"
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

type Controller struct {
	authServie *Service
}

func NewController(db *pgxpool.Pool, jwtConfig *config.JWT) *Controller {
	authService := NewService(db, jwtConfig)
	return &Controller{authService}
}

func (c Controller) Login(ctx *gin.Context) {
	var loginDto LoginRequestDto

	if err := ctx.ShouldBindJSON(&loginDto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	res, err := c.authServie.Login(&loginDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c Controller) Me(ctx *gin.Context) {
	targetUser := ctx.MustGet("user").(PureUserDto)
	ctx.JSON(http.StatusOK, targetUser)
}

func (c Controller) Logout(ctx *gin.Context) {

}

func (c Controller) RefreshTokens(ctx *gin.Context) {
	var refreshTokenDto RefreshTokenRequestDto
	if err := ctx.ShouldBindJSON(&refreshTokenDto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	response, err := c.authServie.RefreshTokens(refreshTokenDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}

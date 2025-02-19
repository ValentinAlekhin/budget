package user

import (
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

type Controller struct {
	userService *Service
}

func NewController(db *pgxpool.Pool) *Controller {
	userService := NewService(db)
	return &Controller{userService: userService}
}

func (c Controller) CreateOne(ctx *gin.Context) {
	var createUserDto CreateUserDto

	if err := ctx.ShouldBindJSON(&createUserDto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	user, err := c.userService.CreateOne(&createUserDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	c.formatResponse(&user)

	ctx.JSON(http.StatusOK, user)
}

func (c Controller) ChangePassword(ctx *gin.Context) {
	var dto ChangePasswordRequestDto
	userId := ctx.MustGet("userId").(int32)

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	err := c.userService.ChangePassword(dto, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.Status(http.StatusOK)
}

func (c Controller) UpdateOne(ctx *gin.Context) {

}

func (c Controller) formatResponse(user *ResponseDto) {
	user.Password = ""
}

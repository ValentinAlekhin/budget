package user

import (
	http_error "budget/internal/http-error"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	userService *Service
}

func NewController(userService *Service) *Controller {
	return &Controller{userService: userService}
}

func (c Controller) CreateOne(ctx *gin.Context) {
	var createUserDto CreateUserDto

	if err := ctx.ShouldBindJSON(&createUserDto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	user, err := c.userService.CreateOne(ctx, &createUserDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	c.formatResponse(&user)

	ctx.JSON(http.StatusOK, user)
}

func (c Controller) UpdateOne(ctx *gin.Context) {

}

func (c Controller) formatResponse(user *ResponseDto) {
	user.Password = ""
}

package user

import (
	db "budget/database"
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) CreateOne(ctx *gin.Context) {
	var createUserDto CreateUserDto

	if err := ctx.ShouldBindJSON(&createUserDto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	user, err := Service.CreateOne(&createUserDto)
	if err != nil {
		ctx.Error(err)
		return
	}

	c.formatResponse(&user)

	ctx.JSON(http.StatusOK, user)
}

func (c controller) UpdateOne(ctx *gin.Context) {

}

func (c controller) formatResponse(user *db.User) {
	user.Password = ""
}

var Controller = controller{}

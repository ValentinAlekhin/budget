package user

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) CreateOne(ctx *gin.Context) {
	var createUserDto CreateUserDto

	if err := ctx.ShouldBindJSON(&createUserDto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := Service.CreateOne(&createUserDto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.formatResponse(&user)

	ctx.JSON(http.StatusOK, user)
}

func (c controller) UpdateOne(ctx *gin.Context) {

}

func (c controller) formatResponse(user *User) {
	user.Password = ""
}

var Controller controller = controller{}

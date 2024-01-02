package category

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type controller struct {
}

func (c controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(uint)

	ctx.JSON(http.StatusOK, Service.GetAll(userId))
}

var Controller = controller{}

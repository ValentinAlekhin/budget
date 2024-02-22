package record

import (
	db "budget/database"
	http_error "budget/internal/http-error"
	"net/http"

	"github.com/gin-gonic/gin"
)

type controller struct {
}

func (c controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(string)

	ctx.JSON(http.StatusOK, Service.GetAll(userId))
}

func (c controller) CreateOne(ctx *gin.Context) {
	var record db.Record

	if err := ctx.ShouldBindJSON(&record); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) CreateMany(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(string)
}

func (c controller) UpdateOne(ctx *gin.Context) {

}

func (c controller) DeleteOne(ctx *gin.Context) {

}

var Controller = controller{}

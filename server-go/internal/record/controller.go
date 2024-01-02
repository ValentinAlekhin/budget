package record

import (
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
	var record Record

	if err := ctx.ShouldBindJSON(&record); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := Service.CreateOne(&record); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) UpdateOne(ctx *gin.Context) {

}

func (c controller) DeleteOne(ctx *gin.Context) {

}

var Controller = controller{}

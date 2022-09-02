package category

import (
	"budget/utils/convert"
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(uint)

	ctx.JSON(http.StatusOK, Service.GetAll(userId))
}

func (c controller) CreateOne(ctx *gin.Context) {
	var dto CreateCategoryRequest

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := ctx.MustGet("userId").(uint)
	category, err := Service.CreateOne(dto, userId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c controller) UpdateOne(ctx *gin.Context) {
	var dto UpdateCategoryRequest

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := convert.StringToUint(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := ctx.MustGet("userId").(uint)
	category, err := Service.UpdateOne(dto, id, userId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c controller) DeleteOne(ctx *gin.Context) {
	id, err := convert.StringToUint(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := ctx.MustGet("userId").(uint)
	category, err := Service.DeleteOne(id, userId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, category)
}

var Controller = controller{}

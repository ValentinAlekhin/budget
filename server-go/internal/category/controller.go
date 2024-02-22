package category

import (
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"net/http"
)

type controller struct {
}

func (c controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(string)
	categories := Service.GetAll(userId)
	ctx.JSON(http.StatusOK, categories)
}

func (c controller) CreateOne(ctx *gin.Context) {
	var dto CreateCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	category := Service.CreateOne(dto, userId)

	ctx.JSON(http.StatusOK, category)
}

func (c controller) UpdateMany(ctx *gin.Context) {
	var dto UpdateManyCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	err, categories := Service.UpdateMany(dto, userId)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, categories)
}

func (c controller) DeleteOne(ctx *gin.Context) {
	id := ctx.Param("id")
	userId := ctx.MustGet("userId").(string)
	err, category := Service.DeleteOne(id, userId)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

var Controller = controller{}

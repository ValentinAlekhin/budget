package category

import (
	http_error "budget/internal/http-error"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	categoryService *Service
}

func NewController(categoryService *Service) *Controller {
	return &Controller{categoryService: categoryService}
}

func (c Controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(int32)
	categories := c.categoryService.GetAll(ctx, userId)
	ctx.JSON(http.StatusOK, categories)
}

func (c Controller) CreateOne(ctx *gin.Context) {
	var dto CreateCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.categoryService.CreateOne(ctx, dto, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c Controller) UpdateOne(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.Error(http_error.NewBadRequestError("Invalid id", ""))
		return
	}

	var dto UpdateCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.categoryService.UpdateOne(ctx, dto, id, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c Controller) UpdateManyOrder(ctx *gin.Context) {
	var dto UpdateManyCategoryOrderRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	categories, err := c.categoryService.UpdateManyOrder(ctx, dto, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, categories)
}

func (c Controller) UpdateMany(ctx *gin.Context) {
	var dto UpdateManyCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	categories, err := c.categoryService.UpdateMany(ctx, dto, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, categories)
}

func (c Controller) DeleteOne(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.Error(http_error.NewBadRequestError("Invalid id", ""))
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.categoryService.DeleteOne(ctx, id, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

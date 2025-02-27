package category

import (
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
	"strconv"
)

type Controller struct {
	categoryService *Service
}

func NewController(db *pgxpool.Pool) *Controller {
	categoryService := NewService(db)
	return &Controller{categoryService: categoryService}
}

func (c Controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(int32)
	categories := c.categoryService.GetAll(userId)
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
	category, err := c.categoryService.CreateOne(dto, userId)
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
	category, err := c.categoryService.UpdateOne(dto, id, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c Controller) UpdateMany(ctx *gin.Context) {
	var dto UpdateManyCategoryRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	categories, err := c.categoryService.UpdateMany(dto, userId)
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
	category, err := c.categoryService.DeleteOne(id, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

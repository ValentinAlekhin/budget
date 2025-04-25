package tag

import (
	http_error "budget/internal/http-error"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type Controller struct {
	tagService *Service
}

func NewController(tagService *Service) *Controller {
	return &Controller{tagService: tagService}
}

func (c Controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(int32)
	tags, err := c.tagService.GetAll(ctx, userId)
	if err != nil {
		ctx.Error(err)
		return
	}
	if len(tags) == 0 {
		ctx.Data(200, "application/json; charset=utf-8", []byte("[]"))
		return
	}

	ctx.JSON(http.StatusOK, tags)
}

func (c Controller) CreateOne(ctx *gin.Context) {
	var dto CreateTagRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.tagService.Create(ctx, dto, userId)
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

	var dto UpdateTagRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.tagService.Update(ctx, id, dto, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

func (c Controller) DeleteOne(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.Error(http_error.NewBadRequestError("Invalid id", ""))
		return
	}

	userId := ctx.MustGet("userId").(int32)
	category, err := c.tagService.Delete(ctx, id, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, category)
}

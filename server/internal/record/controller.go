package record

import (
	http_error "budget/internal/http-error"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	recordService *Service
}

func NewController(recordService *Service) *Controller {
	return &Controller{recordService: recordService}
}

func (c Controller) GetAll(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(int32)

	_, response, err := c.recordService.GetAll(ctx, userId)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.String(http.StatusOK, response)
}

func (c Controller) GetOne(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.Error(http_error.NewBadRequestError("Invalid id", ""))
		return
	}
	userId := ctx.MustGet("userId").(int32)

	record, err := c.recordService.FindOne(ctx, userId, id)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c Controller) CreateOne(ctx *gin.Context) {
	var dto CreateOneRecordRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	record, err := c.recordService.CreateOne(ctx, userId, dto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c Controller) CreateMany(ctx *gin.Context) {
	var dto CreateManyRecordsRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	records, err := c.recordService.CreateMany(ctx, userId, dto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, records)
}

func (c Controller) UpdateOne(ctx *gin.Context) {
	var dto UpdateOneRecordRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	record, err := c.recordService.UpdateOne(ctx, userId, dto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c Controller) DeleteOne(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.Error(http_error.NewBadRequestError("Invalid id", ""))
		return
	}
	userId := ctx.MustGet("userId").(int32)

	record, err := c.recordService.DeleteOne(ctx, userId, id)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c Controller) Adjustment(ctx *gin.Context) {
	var dto AdjustmentRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(int32)
	record, err := c.recordService.Adjustment(ctx, userId, dto)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

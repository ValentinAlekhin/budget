package record

import (
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

func (c controller) GetOne(ctx *gin.Context) {
	id := ctx.Param("id")
	userId := ctx.MustGet("userId").(string)

	err, record := Service.FindOne(userId, id)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) CreateOne(ctx *gin.Context) {
	var dto CreateOneRecordRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	err, record := Service.CreateOne(userId, dto)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) CreateMany(ctx *gin.Context) {
	var dto CreateManyRecordsRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	err, records := Service.CreateMany(userId, dto)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, records)
}

func (c controller) UpdateOne(ctx *gin.Context) {
	var dto UpdateOneRecordRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	err, record := Service.UpdateOne(userId, dto)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) DeleteOne(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(string)
	id := ctx.Param("id")

	err, record := Service.DeleteOne(userId, id)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

func (c controller) Adjustment(ctx *gin.Context) {
	var dto AdjustmentRequestDto

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		err = http_error.NewBadRequestError(err.Error(), "")
		ctx.Error(err)
		return
	}

	userId := ctx.MustGet("userId").(string)
	err, record := Service.Adjustment(userId, dto)

	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, record)
}

var Controller = controller{}

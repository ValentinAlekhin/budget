package user

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type fieldValidationController struct {
}

func (c fieldValidationController) ValidateEmail(ctx *gin.Context) {
	var dto EmailValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := Service.ValidateEmail(dto.Email)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

func (c fieldValidationController) ValidateUsername(ctx *gin.Context) {
	var dto UsernameValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := Service.ValidateUsername(dto.Username)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

var FieldValidationController = fieldValidationController{}

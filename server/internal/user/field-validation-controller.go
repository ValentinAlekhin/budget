package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type FieldValidationController struct {
	userService *Service
}

func NewFieldValidationController(userService *Service) *FieldValidationController {
	return &FieldValidationController{
		userService: userService,
	}
}

func (c FieldValidationController) ValidateEmail(ctx *gin.Context) {
	var dto EmailValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := c.userService.ValidateEmail(ctx, dto.Email)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

func (c FieldValidationController) ValidateUsername(ctx *gin.Context) {
	var dto UsernameValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := c.userService.ValidateUsername(ctx, dto.Username)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

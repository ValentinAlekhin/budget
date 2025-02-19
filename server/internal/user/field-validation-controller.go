package user

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

type FieldValidationController struct {
	userService *Service
}

func NewFieldValidationController(db *pgxpool.Pool) *FieldValidationController {
	return &FieldValidationController{
		userService: NewService(db),
	}
}

func (c FieldValidationController) ValidateEmail(ctx *gin.Context) {
	var dto EmailValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := c.userService.ValidateEmail(dto.Email)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

func (c FieldValidationController) ValidateUsername(ctx *gin.Context) {
	var dto UsernameValidationRequestDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"http-error": err.Error()})
		return
	}

	valid := c.userService.ValidateUsername(dto.Username)
	ctx.JSON(http.StatusOK, ValidationResponseDto{valid})
}

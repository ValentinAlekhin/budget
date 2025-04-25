package category

import (
	"budget/internal/db"
	"github.com/jackc/pgx/v5/pgtype"
)

type CreateCategoryRequestDto struct {
	Name       string                      `json:"name" binding:"required"`
	Type       db.CategoriesTypeEnum       `json:"type" binding:"required,oneof=inc cost"`
	Comment    string                      `json:"comment" binding:"omitempty"`
	Order      int32                       `json:"order" binding:"required"`
	Plan       float64                     `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod db.CategoriesPlanPeriodEnum `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string                      `json:"color" binding:"omitempty,hexcolor"`
	Icon       string                      `json:"icon" binding:"omitempty"`
	TagIds     []int64                     `json:"tagIds" binding:"omitempty"`
}

type UpdateCategoryRequestDto struct {
	ID         int64                       `json:"id"  binding:"required"`
	Name       string                      `json:"name" binding:"required"`
	Type       db.CategoriesTypeEnum       `json:"type" binding:"required,oneof=inc cost"`
	Comment    string                      `json:"comment" binding:"omitempty"`
	Order      int32                       `json:"order" binding:"required,numeric"`
	Plan       float64                     `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod db.CategoriesPlanPeriodEnum `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string                      `json:"color" binding:"omitempty,hexcolor"`
	Icon       string                      `json:"icon" binding:"omitempty"`
	TagIds     []int64                     `json:"tagIds" binding:"omitempty"`
}

type UpdateManyCategoryRequestDto struct {
	Data []UpdateCategoryRequestDto `json:"data" binding:"dive,required"`
}

type UpdateCategoryOrderRequestDto struct {
	ID    int64 `json:"id"  binding:"required"`
	Order int32 `json:"order" binding:"required,numeric"`
}

type UpdateManyCategoryOrderRequestDto struct {
	Data []UpdateCategoryOrderRequestDto `json:"data" binding:"dive,required"`
}

type CategoryResponseDto struct {
	ID         int64                       `json:"id"`
	CreatedAt  pgtype.Timestamp            `json:"createdAt"`
	UpdatedAt  pgtype.Timestamp            `json:"updatedAt"`
	Name       string                      `json:"name"`
	Type       db.CategoriesTypeEnum       `json:"type"`
	Order      int32                       `json:"order"`
	Comment    string                      `json:"comment"`
	UserID     int32                       `json:"userId"`
	DeletedAt  pgtype.Timestamp            `json:"deletedAt"`
	Icon       string                      `json:"icon"`
	Plan       pgtype.Numeric              `json:"plan"`
	Color      string                      `json:"color"`
	PlanPeriod db.CategoriesPlanPeriodEnum `json:"planPeriod"`
	TagIds     []int64                     `json:"tagIds"`
}

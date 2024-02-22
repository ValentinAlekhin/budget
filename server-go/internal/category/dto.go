package category

import "budget/database"

type CreateCategoryRequestDto struct {
	Name       string                `json:"name" binding:"required"`
	Type       database.CategoryType `json:"type" binding:"required,oneof=inc cost"`
	Comment    string                `json:"comment" binding:"omitempty"`
	Order      int                   `json:"order" binding:"required"`
	Plan       int                   `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod database.PlanPeriod   `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string                `json:"color" binding:"omitempty,hexcolor"`
	Icon       string                `json:"icon" binding:"omitempty"`
}

type UpdateCategoryRequestDto struct {
	ID         string                `json:"id"  binding:"required"`
	Name       string                `json:"name" binding:"required"`
	Type       database.CategoryType `json:"type" binding:"required,oneof=inc cost"`
	Comment    string                `json:"comment" binding:"omitempty"`
	Order      int                   `json:"order" binding:"required,numeric"`
	Plan       int                   `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod database.PlanPeriod   `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string                `json:"color" binding:"omitempty,hexcolor"`
	Icon       string                `json:"icon" binding:"omitempty"`
}

type UpdateManyCategoryRequestDto struct {
	Items []UpdateCategoryRequestDto `json:"items" binding:"dive"`
}

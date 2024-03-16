package category

import (
	db "budget/database"
	"budget/internal/ws"
)

type CreateCategoryRequestDto struct {
	Name       string          `json:"name" binding:"required"`
	Type       db.CategoryType `json:"type" binding:"required,oneof=inc cost"`
	Comment    string          `json:"comment" binding:"omitempty"`
	Order      int             `json:"order" binding:"required"`
	Plan       int             `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod db.PlanPeriod   `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string          `json:"color" binding:"omitempty,hexcolor"`
	Icon       string          `json:"icon" binding:"omitempty"`
}

type UpdateCategoryRequestDto struct {
	ID         string          `json:"id"  binding:"required"`
	Name       string          `json:"name" binding:"required"`
	Type       db.CategoryType `json:"type" binding:"required,oneof=inc cost"`
	Comment    string          `json:"comment" binding:"omitempty"`
	Order      int             `json:"order" binding:"required,numeric"`
	Plan       int             `json:"plan" binding:"omitempty,numeric"`
	PlanPeriod db.PlanPeriod   `json:"planPeriod" binding:"required,oneof=day week month quarter year"`
	Color      string          `json:"color" binding:"omitempty,hexcolor"`
	Icon       string          `json:"icon" binding:"omitempty"`
}

type UpdateManyCategoryRequestDto struct {
	Data []UpdateCategoryRequestDto `json:"data" binding:"dive"`
}

type SocketSocketCategoryCudActionPayloadDto struct {
	Action string        `json:"action"`
	Entity string        `json:"entity"`
	List   []db.Category `json:"list"`
}

type SocketCategoryCudActionDto struct {
	ws.BaseSocketActionDto
	Payload SocketSocketCategoryCudActionPayloadDto `json:"payload"`
}

package record

import (
	db "budget/database"
	"budget/internal/ws"
	"gorm.io/gorm"
	"time"
)

type CreateOneRecordRequestDto struct {
	Amount     int       `json:"amount" binding:"required"`
	Comment    string    `json:"comment" binding:"omitempty"`
	CategoryID string    `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type UpdateOneRecordRequestDto struct {
	ID         string    `json:"id" binding:"required"`
	Amount     int       `json:"amount" binding:"required"`
	Comment    string    `json:"comment" binding:"omitempty"`
	CategoryID string    `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type CreateManyRecordsRequestDto struct {
	Data []CreateOneRecordRequestDto `json:"data" binding:"dive"`
}

type AdjustmentRequestDto struct {
	Diff int `json:"diff" binding:"required"`
}

type SocketSocketRecordCudActionPayloadDto struct {
	Action string              `json:"action"`
	Entity string              `json:"entity"`
	List   []RecordResponseDto `json:"list"`
}

type SocketRecordCudActionDto struct {
	ws.BaseSocketActionDto
	Payload SocketSocketRecordCudActionPayloadDto `json:"payload"`
}

type RecordResponseDto struct {
	ID         string          `json:"id"`
	CreatedAt  time.Time       `json:"createdAt"`
	UpdatedAt  time.Time       `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt  `json:"deletedAt,omitempty"`
	Amount     int             `json:"amount"`
	Comment    string          `json:"comment,omitempty"`
	CategoryID string          `json:"categoryId"`
	Timestamp  time.Time       `json:"timestamp"`
	Type       db.CategoryType `json:"type"`
}

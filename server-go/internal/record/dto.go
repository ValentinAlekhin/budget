package record

import (
	"budget/internal/db/sqlc/budget"
	"github.com/jackc/pgx/v5/pgtype"
	"time"
)

type CreateOneRecordRequestDto struct {
	Amount     float64   `json:"amount" binding:"required,gte=0,lte=100000000"`
	Comment    string    `json:"comment" binding:"omitempty,max=100"`
	CategoryID int64     `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type UpdateOneRecordRequestDto struct {
	ID         int64     `json:"id" binding:"required"`
	Amount     float64   `json:"amount" binding:"required,gte=0,lte=100000000"`
	Comment    string    `json:"comment" binding:"omitempty,max=100"`
	CategoryID int64     `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type CreateManyRecordsRequestDto struct {
	Data []CreateOneRecordRequestDto `json:"data" binding:"dive"`
}

type AdjustmentRequestDto struct {
	Diff float64 `json:"diff" binding:"required,gte=-100000000,lte=100000000"`
}

type RecordResponseDto struct {
	ID         int64                     `json:"id"`
	CreatedAt  pgtype.Timestamp          `json:"createdAt"`
	UpdatedAt  pgtype.Timestamp          `json:"updatedAt"`
	Amount     pgtype.Numeric            `json:"amount"`
	Comment    string                    `json:"comment"`
	Timestamp  pgtype.Timestamp          `json:"timestamp"`
	CategoryID int64                     `json:"categoryId"`
	DeletedAt  pgtype.Timestamp          `json:"deletedAt"`
	Type       budget.CategoriesTypeEnum `json:"type"`
}

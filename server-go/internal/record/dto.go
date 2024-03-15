package record

import (
	db "budget/database"
	"budget/internal/ws"
	"time"
)

type CreateOneRecordRequestDto struct {
	Amount     int       `json:"amount" binding:"required"`
	Comment    string    `json:"comment" binding:"required"`
	CategoryId string    `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type UpdateOneRecordRequestDto struct {
	ID         string    `json:"id" binding:"required"`
	Amount     int       `json:"amount" binding:"required"`
	Comment    string    `json:"comment" binding:"required"`
	CategoryId string    `json:"categoryId" binding:"required"`
	Timestamp  time.Time `json:"timestamp" binding:"required"`
}

type CreateManyRecordsRequestDto struct {
	Items []CreateOneRecordRequestDto `json:"items" binding:"dive"`
}

type AdjustmentRequestDto struct {
	Diff int `json:"diff" binding:"required"`
}

type SocketSocketRecordCudActionPayloadDto struct {
	Action string      `json:"action"`
	List   []db.Record `json:"list"`
}

type SocketRecordCudActionDto struct {
	ws.BaseSocketActionDto
	Payload SocketSocketRecordCudActionPayloadDto `json:"payload"`
}

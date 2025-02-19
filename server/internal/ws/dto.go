package ws

import "time"

type BaseSocketActionDto[T any] struct {
	Type      string                       `json:"type"`
	Timestamp time.Time                    `json:"timestamp"`
	Payload   SocketCudActionPayloadDto[T] `json:"payload"`
}

type SocketCudActionPayloadDto[T any] struct {
	Action string `json:"action"`
	Entity string `json:"entity"`
	List   []T    `json:"list"`
}

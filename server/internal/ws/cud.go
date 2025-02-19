package ws

import (
	"encoding/json"
	"time"
)

type CudService[T any] struct {
	entity string
}

func NewCudService[T any](entity string) *CudService[T] {
	return &CudService[T]{entity: entity}
}

func SendOne() {

}

func (s CudService[T]) SendOne(userId int32, action string, item T) {
	s.SendMany(userId, action, []T{item})
}

func (s CudService[T]) SendMany(userId int32, action string, list []T) {
	jsonMsg, _ := json.Marshal(BaseSocketActionDto[T]{
		Type:      "cud",
		Timestamp: time.Now(),
		Payload: SocketCudActionPayloadDto[T]{
			Action: action,
			List:   list,
			Entity: s.entity,
		},
	})
	Manager.SendToUser(userId, jsonMsg)
}

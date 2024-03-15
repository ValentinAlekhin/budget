package ws

import "time"

type BaseSocketActionDto struct {
	Type      string    `json:"type"`
	Timestamp time.Time `json:"timestamp"`
}

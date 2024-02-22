package database

import (
	"budget/config"
	"github.com/oklog/ulid/v2"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Model struct {
	ID        string         `json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"`
}

func (m *Model) BeforeCreate(tx *gorm.DB) (err error) {
	m.ID = ulid.Make().String()

	return nil
}

var Instance *gorm.DB

func init() {
	dsn := config.DB.GetDns()
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	Instance = db
}

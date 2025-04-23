package tag

import "github.com/jackc/pgx/v5/pgtype"

type TagResponseDto struct {
	ID        int64            `json:"id"`
	CreatedAt pgtype.Timestamp `json:"createdAt"`
	UpdatedAt pgtype.Timestamp `json:"updatedAt"`
	Name      string           `json:"name"`
	Color     string           `json:"color"`
	Icon      string           `json:"icon"`
	DeletedAt pgtype.Timestamp `json:"deletedAt"`
}

type CreateTagRequestDto struct {
	Name  string `json:"name" binding:"required"`
	Color string `json:"color" binding:"omitempty,hexcolor"`
	Icon  string `json:"icon" binding:"omitempty"`
}

type UpdateTagRequestDto struct {
	Name  string `json:"name" binding:"required"`
	Color string `json:"color" binding:"omitempty,hexcolor"`
	Icon  string `json:"icon" binding:"omitempty"`
}

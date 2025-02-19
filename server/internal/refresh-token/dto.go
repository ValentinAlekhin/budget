package refresh_token

import "github.com/jackc/pgx/v5/pgtype"

type ResponseDto struct {
	ID           int64            `json:"id"`
	CreatedAt    pgtype.Timestamp `json:"createdAt"`
	UpdatedAt    pgtype.Timestamp `json:"updatedAt"`
	RefreshToken string           `json:"refreshToken"`
	ExpiresAt    pgtype.Timestamp `json:"expiresAt"`
	UserID       int32            `json:"userId"`
	DeletedAt    pgtype.Timestamp `json:"deletedAt"`
}

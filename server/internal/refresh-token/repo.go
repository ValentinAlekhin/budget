package refresh_token

import (
	"budget/internal/db"
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repo struct {
	conn *pgxpool.Pool
	q    *db.Queries
}

func NewRepo(conn *pgxpool.Pool) *Repo {
	return &Repo{conn: conn, q: db.New(conn)}
}

// Create создает новый токен обновления
func (r *Repo) Create(ctx context.Context, token db.CreateRefreshTokenParams) (ResponseDto, error) {
	refreshToken, err := r.q.CreateRefreshToken(ctx, token)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to create refresh token: %w", err)
	}
	return convertToResponseDto(refreshToken), nil
}

// GetByID получает токен обновления по ID
func (r *Repo) GetByID(ctx context.Context, id int64) (ResponseDto, error) {
	refreshToken, err := r.q.GetRefreshTokenByID(ctx, id)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to get refresh token by ID: %w", err)
	}
	return convertToResponseDto(refreshToken), nil
}

func (r *Repo) ListByUser(ctx context.Context, userID int32) ([]ResponseDto, error) {
	tokens, err := r.q.ListRefreshTokensByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	return convertListToResponseDto(tokens), nil
}

// Update обновляет токен обновления
func (r *Repo) Update(ctx context.Context, token db.UpdateRefreshTokenParams) error {
	err := r.q.UpdateRefreshToken(ctx, token)
	if err != nil {
		return fmt.Errorf("failed to update refresh token with params %+v: %w", token, err)
	}
	return nil
}

// SoftDelete выполняет мягкое удаление токена обновления
func (r *Repo) SoftDelete(ctx context.Context, id int64) error {
	err := r.q.SoftDeleteRefreshToken(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to soft delete refresh token with ID %d: %w", id, err)
	}
	return nil
}

// Delete полностью удаляет токен обновления
func (r *Repo) Delete(ctx context.Context, id int64) error {
	err := r.q.DeleteRefreshToken(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete refresh token with ID %d: %w", id, err)
	}
	return nil
}

func convertToResponseDto(c db.RefreshToken) ResponseDto {
	return ResponseDto(c)
}

func convertListToResponseDto(list []db.RefreshToken) []ResponseDto {
	result := make([]ResponseDto, len(list))
	for i, item := range list {
		result[i] = ResponseDto(item)
	}

	return result
}

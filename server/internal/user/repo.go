package user

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

func NewUserRepo(conn *pgxpool.Pool) *Repo {
	return &Repo{
		conn: conn,
		q:    db.New(conn),
	}
}

// Create создает нового пользователя
func (r *Repo) Create(ctx context.Context, params db.CreateUserParams) (ResponseDto, error) {
	tx, err := r.conn.Begin(ctx)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)
	user, err := qtx.CreateUser(ctx, params)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to create user: %w", err)
	}

	newAdj := db.CreateCategoryParams{
		Name:       "Adjustment",
		Type:       db.CategoriesTypeEnumAdjustment,
		Comment:    "Service category",
		PlanPeriod: db.CategoriesPlanPeriodEnumYear,
		UserID:     user.ID,
	}
	_, err = qtx.CreateCategory(ctx, newAdj)
	if err != nil {
		_ = tx.Rollback(ctx)
		return ResponseDto{}, fmt.Errorf("transaction failed: %w", err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("unable to commit transaction: %w", err)
	}

	return convertToResponseDto(user), nil
}

// GetByEmail получает пользователя по email
func (r *Repo) GetByEmail(ctx context.Context, email string) (ResponseDto, error) {
	user, err := r.q.GetUserByEmail(ctx, email)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to get user by email: %w", err)
	}
	return convertToResponseDto(user), nil
}

// CountByEmailOrUsername получает пользователя по email или имени пользователя
func (r *Repo) CountByEmailOrUsername(ctx context.Context, arg db.CountUserByEmailOrUsernameParams) (int64, error) {
	count, err := r.q.CountUserByEmailOrUsername(ctx, arg)
	if err != nil {
		return 0, fmt.Errorf("failed to get users count by email or username: %w", err)
	}
	return count, nil
}

// GetByUsername получает пользователя по имени пользователя
func (r *Repo) GetByUsername(ctx context.Context, username string) (ResponseDto, error) {
	user, err := r.q.GetUserByUsername(ctx, username)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to get user by username: %w", err)
	}
	return convertToResponseDto(user), nil
}

// GetByID получает пользователя по ID
func (r *Repo) GetByID(ctx context.Context, id int32) (ResponseDto, error) {
	user, err := r.q.GetUserByID(ctx, id)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to get user by ID: %w", err)
	}
	return convertToResponseDto(user), nil
}

// List возвращает список всех пользователей
func (r *Repo) List(ctx context.Context) ([]ResponseDto, error) {
	users, err := r.q.ListUsers(ctx)
	if err != nil {
		return nil, err
	}

	return convertListToResponseDto(users), nil
}

// Update обновляет данные пользователя
func (r *Repo) Update(ctx context.Context, params db.UpdateUserParams) error {
	return r.q.UpdateUser(ctx, params)
}

// SoftDelete выполняет мягкое удаление пользователя
func (r *Repo) SoftDelete(ctx context.Context, id int32) error {
	return r.q.SoftDeleteUser(ctx, id)
}

// Delete полностью удаляет пользователя
func (r *Repo) Delete(ctx context.Context, id int32) error {
	return r.q.DeleteUser(ctx, id)
}

func convertToResponseDto(c db.User) ResponseDto {
	return ResponseDto(c)
}

func convertListToResponseDto(list []db.User) []ResponseDto {
	result := make([]ResponseDto, len(list))
	for i, item := range list {
		result[i] = ResponseDto(item)
	}

	return result
}

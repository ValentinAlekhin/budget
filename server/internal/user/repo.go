package user

import (
	"budget/internal/db/sqlc/budget"
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repo struct {
	db *pgxpool.Pool
	q  *budget.Queries
}

func NewUserRepo(db *pgxpool.Pool) *Repo {
	return &Repo{
		db: db,
		q:  budget.New(db),
	}
}

// Create создает нового пользователя
func (r *Repo) Create(ctx context.Context, params budget.CreateUserParams) (ResponseDto, error) {
	user, err := r.q.CreateUser(ctx, params)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to create user: %w", err)
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

// GetByEmailOrUsername получает пользователя по email или имени пользователя
func (r *Repo) GetByEmailOrUsername(ctx context.Context, arg budget.GetUserByEmailOrUsernameParams) (ResponseDto, error) {
	user, err := r.q.GetUserByEmailOrUsername(ctx, arg)
	if err != nil {
		return ResponseDto{}, fmt.Errorf("failed to get user by email or username: %w", err)
	}
	return convertToResponseDto(user), nil
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
func (r *Repo) Update(ctx context.Context, params budget.UpdateUserParams) error {
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

func convertToResponseDto(c budget.User) ResponseDto {
	return ResponseDto(c)
}

func convertListToResponseDto(list []budget.User) []ResponseDto {
	result := make([]ResponseDto, len(list))
	for i, item := range list {
		result[i] = ResponseDto(item)
	}

	return result
}

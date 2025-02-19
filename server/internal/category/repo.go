package category

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

func NewCategoryRepo(db *pgxpool.Pool) *Repo {
	return &Repo{
		db: db,
		q:  budget.New(db),
	}
}

// Create создает новую категорию
func (r *Repo) Create(ctx context.Context, params budget.CreateCategoryParams) (CategoryResponseDto, error) {
	category, err := r.q.CreateCategory(ctx, params)
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to create category: %w", err)
	}
	return convertToResponseDto(category), nil
}

// GetByID получает категорию по ID
func (r *Repo) GetByID(ctx context.Context, id int64) (CategoryResponseDto, error) {
	category, err := r.q.GetCategoryByID(ctx, id)
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to get category by ID: %w", err)
	}
	return convertToResponseDto(category), nil
}

// GetByIDAndUserID получает категорию по ID и UserID
func (r *Repo) GetByIDAndUserID(ctx context.Context, id int64, userId int32) (CategoryResponseDto, error) {
	category, err := r.q.GetCategoryByIDAndUserID(ctx, budget.GetCategoryByIDAndUserIDParams{
		ID:     id,
		UserID: userId,
	})
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to get category by ID and UserID: %w", err)
	}
	return convertToResponseDto(category), nil
}

// GetAdjustmentUserID получает категорию корректировки по UserID
func (r *Repo) GetAdjustmentUserID(ctx context.Context, userId int32) (CategoryResponseDto, error) {
	category, err := r.q.GetAdjustmentCategoryUserID(ctx, userId)
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to get adjustment category by UserID: %w", err)
	}
	return convertToResponseDto(category), nil
}

// GetByIDAndUserIDs получает категории по списку ID и UserID
func (r *Repo) GetByIDAndUserIDs(ctx context.Context, ids []int64, userId int32) ([]CategoryResponseDto, error) {
	categories, err := r.q.GetCategoriesByIDAndUserIDs(ctx, budget.GetCategoriesByIDAndUserIDsParams{
		Column1: ids,
		UserID:  userId,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get categories by IDs and UserID: %w", err)
	}

	return convertListToResponseDto(categories), nil
}

// ListByUser возвращает список всех категорий пользователя
func (r *Repo) ListByUser(ctx context.Context, userID int32) ([]CategoryResponseDto, error) {
	categories, err := r.q.ListCategoriesByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list categories by user: %w", err)
	}

	return convertListToResponseDto(categories), nil
}

// Update обновляет данные категории
func (r *Repo) Update(ctx context.Context, params budget.UpdateCategoryParams) (CategoryResponseDto, error) {
	category, err := r.q.UpdateCategory(ctx, params)
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to update category: %w", err)
	}
	return convertToResponseDto(category), nil
}

// UpdateMany обновляет данные нескольких категорий
func (r *Repo) UpdateMany(ctx context.Context, params []budget.UpdateCategoryParams) ([]CategoryResponseDto, error) {
	result := make([]budget.Category, len(params))
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)

	for i, param := range params {
		category, err := qtx.UpdateCategory(ctx, param)
		if err != nil {
			_ = tx.Rollback(ctx)
			return nil, fmt.Errorf("transaction failed: %w", err)
		}
		result[i] = category
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to commit transaction: %w", err)
	}

	return convertListToResponseDto(result), nil
}

// SoftDelete выполняет мягкое удаление категории
func (r *Repo) SoftDelete(ctx context.Context, id int64, userId int32) (CategoryResponseDto, error) {
	category, err := r.q.SoftDeleteCategory(ctx, budget.SoftDeleteCategoryParams{
		ID:     id,
		UserID: userId,
	})
	if err != nil {
		return CategoryResponseDto{}, fmt.Errorf("failed to soft delete category: %w", err)
	}
	return convertToResponseDto(category), nil
}

// Delete полностью удаляет категорию
func (r *Repo) Delete(ctx context.Context, id int64) (CategoryResponseDto, error) {
	category, err := r.q.DeleteCategory(ctx, id)
	if err != nil {
		return CategoryResponseDto{}, err
	}

	return convertToResponseDto(category), nil
}

func convertToResponseDto(c budget.Category) CategoryResponseDto {
	return CategoryResponseDto(c)
}

func convertListToResponseDto(list []budget.Category) []CategoryResponseDto {
	result := make([]CategoryResponseDto, len(list))
	for i, item := range list {
		result[i] = CategoryResponseDto(item)
	}

	return result
}

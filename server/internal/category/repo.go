package category

import (
	"budget/internal/db"
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"slices"
)

type Repo struct {
	conn *pgxpool.Pool
	q    *db.Queries
}

func NewCategoryRepo(conn *pgxpool.Pool) *Repo {
	return &Repo{
		conn: conn,
		q:    db.New(conn),
	}
}

func (r *Repo) Create(ctx context.Context, params db.CreateCategoryParams, tagIds []int64) (db.Category, []db.CategoryTag, error) {
	tx, err := r.conn.Begin(ctx)
	if err != nil {
		return db.Category{}, nil, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)

	category, err := qtx.CreateCategory(ctx, params)
	if err != nil {
		_ = tx.Rollback(ctx)
		return db.Category{}, nil, fmt.Errorf("transaction failed, create category err: %w", err)
	}

	categoryTags := make([]db.CategoryTag, 0, len(tagIds))

	if tagIds != nil {
		for _, tagId := range tagIds {
			tag := db.AddTagToCategoryParams{
				CategoryID: category.ID,
				TagID:      tagId,
			}
			err := qtx.AddTagToCategory(ctx, tag)
			if err != nil {
				_ = tx.Rollback(ctx)
				return db.Category{}, nil, fmt.Errorf("transaction failed, add tag err: %w", err)
			}

			categoryTags = append(categoryTags, db.CategoryTag(tag))
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return db.Category{}, nil, fmt.Errorf("transaction failed, commit err: %w", err)
	}

	return category, categoryTags, nil
}

func (r *Repo) GetByID(ctx context.Context, id int64) (db.Category, error) {
	return r.q.GetCategoryByID(ctx, id)
}

func (r *Repo) GetByIDAndUserID(ctx context.Context, id int64, userId int32) (db.Category, error) {
	return r.q.GetCategoryByIDAndUserID(ctx, db.GetCategoryByIDAndUserIDParams{
		ID:     id,
		UserID: userId,
	})
}

func (r *Repo) GetAdjustmentUserID(ctx context.Context, userId int32) (db.Category, error) {
	return r.q.GetAdjustmentCategoryUserID(ctx, userId)
}

func (r *Repo) GetByIDAndUserIDs(ctx context.Context, ids []int64, userId int32) ([]db.Category, error) {
	return r.q.GetCategoriesByIDAndUserIDs(ctx, db.GetCategoriesByIDAndUserIDsParams{
		Column1: ids,
		UserID:  userId,
	})
}

func (r *Repo) ListByUser(ctx context.Context, userID int32) ([]db.Category, error) {
	return r.q.ListCategoriesByUser(ctx, userID)
}

func (r *Repo) GetTagsIdsByCategoryId(ctx context.Context, categoryId int64) ([]db.CategoryTag, error) {
	return r.q.GetTagIdsByCategoryID(ctx, categoryId)
}

func (r *Repo) GetTagsIdsByCategoryIds(ctx context.Context, categoryIds []int64) ([]db.CategoryTag, error) {
	return r.q.GetTagIdsByCategoryIds(ctx, categoryIds)
}

func (r *Repo) Update(ctx context.Context, params db.UpdateCategoryParams, tagIds []int64) (db.Category, []db.CategoryTag, error) {
	tx, err := r.conn.Begin(ctx)
	if err != nil {
		return db.Category{}, nil, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)

	category, err := qtx.UpdateCategory(ctx, params)
	if err != nil {
		_ = tx.Rollback(ctx)
		return db.Category{}, nil, fmt.Errorf("transaction failed, update category err: %w", err)
	}

	oldCategoryTags, err := qtx.GetTagIdsByCategoryID(ctx, category.ID)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			_ = tx.Rollback(ctx)
			return db.Category{}, nil, fmt.Errorf("transaction failed, get old category tags err: %w", err)
		}
	}

	tagsToDelete := make([]int64, 0, len(oldCategoryTags))
	for _, categoryTag := range oldCategoryTags {
		contains := slices.Contains(tagIds, categoryTag.TagID)
		if !contains {
			tagsToDelete = append(tagsToDelete, categoryTag.TagID)
		}
	}

	err = qtx.RemoveTagsFromCategory(ctx, db.RemoveTagsFromCategoryParams{
		CategoryID: category.ID,
		Column2:    tagsToDelete,
	})
	if err != nil {
		_ = tx.Rollback(ctx)
		return db.Category{}, nil, fmt.Errorf("transaction failed, remove tags err: %w", err)
	}

	categoryTags := make([]db.CategoryTag, 0, len(tagIds))
	for _, tagId := range tagIds {
		tag := db.AddTagToCategoryParams{
			CategoryID: category.ID,
			TagID:      tagId,
		}
		err := qtx.AddTagToCategory(ctx, tag)
		if err != nil {
			_ = tx.Rollback(ctx)
			return db.Category{}, nil, fmt.Errorf("transaction failed, add tag err: %w", err)
		}

		categoryTags = append(categoryTags, db.CategoryTag(tag))
	}

	err = tx.Commit(ctx)
	if err != nil {
		return db.Category{}, nil, fmt.Errorf("transaction failed, commit err: %w", err)
	}

	return category, categoryTags, nil
}

func (r *Repo) UpdateManyOrder(ctx context.Context, params []db.UpdateCategoryOrderParams) ([]db.Category, error) {
	result := make([]db.Category, len(params))
	tx, err := r.conn.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)

	for i, param := range params {
		category, err := qtx.UpdateCategoryOrder(ctx, param)
		if err != nil {
			_ = tx.Rollback(ctx)
			return nil, fmt.Errorf("transaction failed: %w", err)
		}
		result[i] = category
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("unable to commit transaction: %w", err)
	}

	return result, nil
}

func (r *Repo) UpdateMany(ctx context.Context, params []db.UpdateCategoryParams) ([]db.Category, error) {
	result := make([]db.Category, len(params))
	tx, err := r.conn.Begin(ctx)
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

	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("unable to commit transaction: %w", err)
	}

	return result, nil
}

func (r *Repo) SoftDelete(ctx context.Context, id int64, userId int32) (db.Category, error) {
	return r.q.SoftDeleteCategory(ctx, db.SoftDeleteCategoryParams{
		ID:     id,
		UserID: userId,
	})
}

func (r *Repo) Delete(ctx context.Context, id int64) (db.Category, error) {
	return r.q.DeleteCategory(ctx, id)
}

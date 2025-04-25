package tag

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
	return &Repo{
		conn: conn,
		q:    db.New(conn),
	}
}

func (r *Repo) Create(ctx context.Context, params db.CreateTagParams) (db.Tag, error) {
	tag, err := r.q.CreateTag(ctx, params)
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to create tag: %w", err)
	}
	return tag, nil
}

func (r *Repo) Update(ctx context.Context, params db.UpdateTagParams) (db.Tag, error) {
	tag, err := r.q.UpdateTag(ctx, params)
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to update tag: %w", err)
	}
	return tag, nil
}

func (r *Repo) Delete(ctx context.Context, id int64) (db.Tag, error) {
	tag, err := r.q.DeleteTag(ctx, id)
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to delete tag: %w", err)
	}
	return tag, nil
}

func (r *Repo) GetByID(ctx context.Context, id int64) (db.Tag, error) {
	tag, err := r.q.GetTagByID(ctx, id)
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to get tag by ID: %w", err)
	}
	return tag, nil
}

func (r *Repo) GetByIDAndUserID(ctx context.Context, id int64, userId int32) (db.Tag, error) {
	tag, err := r.q.GetTagByIDAndUserID(ctx, db.GetTagByIDAndUserIDParams{
		ID:     id,
		UserID: userId,
	})
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to get tag by ID and user ID: %w", err)
	}
	return tag, nil
}

func (r *Repo) GetByIDsAndUser(ctx context.Context, params db.GetTagsByIDsAndUserParams) ([]db.Tag, error) {
	tags, err := r.q.GetTagsByIDsAndUser(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to get tags by IDs and user: %w", err)
	}
	return tags, nil
}

func (r *Repo) GetTagByAndNameAndUserID(ctx context.Context, userId int32, name string) (db.Tag, error) {
	tag, err := r.q.GetTagByNameAndUserID(ctx, db.GetTagByNameAndUserIDParams{
		UserID: userId,
		Name:   name,
	})
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to get tag by not id and name and userId: %w", err)
	}
	return tag, nil
}

func (r *Repo) GetTagByNotIDAndNameAndUserID(ctx context.Context, id int64, userId int32, name string) (db.Tag, error) {
	tag, err := r.q.GetTagByNotIDAndNameAndUserID(ctx, db.GetTagByNotIDAndNameAndUserIDParams{
		ID:     id,
		UserID: userId,
		Name:   name,
	})
	if err != nil {
		return db.Tag{}, fmt.Errorf("failed to get tag by not id and name and userId: %w", err)
	}
	return tag, nil
}

func (r *Repo) ListByUserID(ctx context.Context, userID int32) ([]db.Tag, error) {
	tags, err := r.q.ListTagsByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list tags by user ID: %w", err)
	}
	return tags, nil
}

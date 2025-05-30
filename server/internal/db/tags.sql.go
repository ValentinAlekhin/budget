// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: tags.sql

package db

import (
	"context"
)

const createTag = `-- name: CreateTag :one
INSERT INTO tags (name, color, icon, user_id)
VALUES ($1, $2, $3, $4)
RETURNING id, created_at, updated_at, name, color, icon, user_id, deleted_at
`

type CreateTagParams struct {
	Name   string `json:"name"`
	Color  string `json:"color"`
	Icon   string `json:"icon"`
	UserID int32  `json:"userId"`
}

func (q *Queries) CreateTag(ctx context.Context, arg CreateTagParams) (Tag, error) {
	row := q.db.QueryRow(ctx, createTag,
		arg.Name,
		arg.Color,
		arg.Icon,
		arg.UserID,
	)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const deleteTag = `-- name: DeleteTag :one
UPDATE tags
SET deleted_at = now()
WHERE id = $1
  AND deleted_at IS NULL
RETURNING id, created_at, updated_at, name, color, icon, user_id, deleted_at
`

func (q *Queries) DeleteTag(ctx context.Context, id int64) (Tag, error) {
	row := q.db.QueryRow(ctx, deleteTag, id)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const getTagByID = `-- name: GetTagByID :one
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE id = $1
  AND deleted_at IS NULL
`

func (q *Queries) GetTagByID(ctx context.Context, id int64) (Tag, error) {
	row := q.db.QueryRow(ctx, getTagByID, id)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const getTagByIDAndUserID = `-- name: GetTagByIDAndUserID :one
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE id = $1
  AND user_id = $2
  AND deleted_at IS NULL
`

type GetTagByIDAndUserIDParams struct {
	ID     int64 `json:"id"`
	UserID int32 `json:"userId"`
}

func (q *Queries) GetTagByIDAndUserID(ctx context.Context, arg GetTagByIDAndUserIDParams) (Tag, error) {
	row := q.db.QueryRow(ctx, getTagByIDAndUserID, arg.ID, arg.UserID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const getTagByNameAndUserID = `-- name: GetTagByNameAndUserID :one
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE user_id = $1
  AND name = $2
  AND deleted_at IS NULL
ORDER BY name
`

type GetTagByNameAndUserIDParams struct {
	UserID int32  `json:"userId"`
	Name   string `json:"name"`
}

func (q *Queries) GetTagByNameAndUserID(ctx context.Context, arg GetTagByNameAndUserIDParams) (Tag, error) {
	row := q.db.QueryRow(ctx, getTagByNameAndUserID, arg.UserID, arg.Name)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const getTagByNotIDAndNameAndUserID = `-- name: GetTagByNotIDAndNameAndUserID :one
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE id != $1
  AND user_id = $2
  AND name = $3
  AND deleted_at IS NULL
ORDER BY name
`

type GetTagByNotIDAndNameAndUserIDParams struct {
	ID     int64  `json:"id"`
	UserID int32  `json:"userId"`
	Name   string `json:"name"`
}

func (q *Queries) GetTagByNotIDAndNameAndUserID(ctx context.Context, arg GetTagByNotIDAndNameAndUserIDParams) (Tag, error) {
	row := q.db.QueryRow(ctx, getTagByNotIDAndNameAndUserID, arg.ID, arg.UserID, arg.Name)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

const getTagsByIDsAndUser = `-- name: GetTagsByIDsAndUser :many
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE user_id = $1
  AND id = ANY ($2::bigint[])
  AND deleted_at IS NULL
`

type GetTagsByIDsAndUserParams struct {
	UserID  int32   `json:"userId"`
	Column2 []int64 `json:"column2"`
}

func (q *Queries) GetTagsByIDsAndUser(ctx context.Context, arg GetTagsByIDsAndUserParams) ([]Tag, error) {
	rows, err := q.db.Query(ctx, getTagsByIDsAndUser, arg.UserID, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Tag
	for rows.Next() {
		var i Tag
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
			&i.Color,
			&i.Icon,
			&i.UserID,
			&i.DeletedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listTagsByUserID = `-- name: ListTagsByUserID :many
SELECT id, created_at, updated_at, name, color, icon, user_id, deleted_at
FROM tags
WHERE user_id = $1
  AND deleted_at IS NULL
ORDER BY name
`

func (q *Queries) ListTagsByUserID(ctx context.Context, userID int32) ([]Tag, error) {
	rows, err := q.db.Query(ctx, listTagsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Tag
	for rows.Next() {
		var i Tag
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
			&i.Color,
			&i.Icon,
			&i.UserID,
			&i.DeletedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateTag = `-- name: UpdateTag :one
UPDATE tags
SET name       = $2,
    color      = $3,
    icon       = $4,
    updated_at = now()
WHERE id = $1
  AND deleted_at IS NULL
RETURNING id, created_at, updated_at, name, color, icon, user_id, deleted_at
`

type UpdateTagParams struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Icon  string `json:"icon"`
}

func (q *Queries) UpdateTag(ctx context.Context, arg UpdateTagParams) (Tag, error) {
	row := q.db.QueryRow(ctx, updateTag,
		arg.ID,
		arg.Name,
		arg.Color,
		arg.Icon,
	)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Color,
		&i.Icon,
		&i.UserID,
		&i.DeletedAt,
	)
	return i, err
}

-- name: CreateCategory :one
INSERT INTO categories (name, type, "order", comment, user_id, icon, plan, color, plan_period)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: GetCategoryByID :one
SELECT *
FROM categories
WHERE id = $1;

-- name: GetCategoryByIDAndUserID :one
SELECT *
FROM categories
WHERE id = $1
  and user_id = $2
  and deleted_at is null;

-- name: GetAdjustmentCategoryUserID :one
SELECT *
FROM categories
WHERE user_id = $1
  and type = 'adjustment';

-- name: GetCategoriesByIDAndUserIDs :many
SELECT *
FROM categories
WHERE id = ANY ($1::bigint[])
  and user_id = $2;

-- name: ListCategoriesByUser :many
SELECT *
FROM categories
WHERE user_id = $1
  and deleted_at is null;

-- name: UpdateCategory :one
UPDATE categories
SET name        = $2,
    type        = $3,
    "order"     = $4,
    comment     = $5,
    icon        = $6,
    plan        = $7,
    color       = $8,
    plan_period = $9,
    updated_at  = now()
WHERE id = $1
  and user_id = $10
returning *;

-- name: SoftDeleteCategory :one
UPDATE categories
SET deleted_at = now(),
    updated_at = now()
WHERE id = $1
  and user_id = $2
returning *;

-- name: DeleteCategory :one
DELETE
FROM categories
WHERE id = $1
returning *;
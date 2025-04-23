-- name: CreateTag :one
INSERT INTO tags (name, color, icon, user_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetTagByID :one
SELECT *
FROM tags
WHERE id = $1
  AND deleted_at IS NULL;

-- name: GetTagByIDAndUserID :one
SELECT *
FROM tags
WHERE id = $1
  AND user_id = $2
  AND deleted_at IS NULL;


-- name: ListTagsByUserID :many
SELECT *
FROM tags
WHERE user_id = $1
  AND deleted_at IS NULL
ORDER BY name;

-- name: GetTagByNameAndUserID :one
SELECT *
FROM tags
WHERE user_id = $1
  AND name = $2
  AND deleted_at IS NULL
ORDER BY name;

-- name: GetTagByNotIDAndNameAndUserID :one
SELECT *
FROM tags
WHERE id != $1
  AND user_id = $2
  AND name = $3
  AND deleted_at IS NULL
ORDER BY name;

-- name: GetTagsByIDsAndUser :many
SELECT *
FROM tags
WHERE user_id = $1
  AND id = ANY ($2::bigint[])
  AND deleted_at IS NULL;

-- name: UpdateTag :one
UPDATE tags
SET name       = $2,
    color      = $3,
    icon       = $4,
    updated_at = now()
WHERE id = $1
  AND deleted_at IS NULL
RETURNING *;

-- name: DeleteTag :one
UPDATE tags
SET deleted_at = now()
WHERE id = $1
  AND deleted_at IS NULL
RETURNING *;

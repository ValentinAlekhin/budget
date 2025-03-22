-- name: CreateUser :one
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1;

-- name: CountUserByEmailOrUsername :one
SELECT count(*)
FROM users
WHERE email = $1
   or username = $2;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: GetUserByUsername :one
SELECT *
FROM users
WHERE username = $1;

-- name: ListUsers :many
SELECT *
FROM users;

-- name: UpdateUser :exec
UPDATE users
SET username   = $2,
    email      = $3,
    password   = $4,
    updated_at = now()
WHERE id = $1;

-- name: SoftDeleteUser :exec
UPDATE users
SET deleted_at = now(),
    updated_at = now()
WHERE id = $1;

-- name: DeleteUser :exec
DELETE
FROM users
WHERE id = $1;

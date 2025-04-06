-- Таблица refresh_tokens

-- Создание refresh-токена
-- name: CreateRefreshToken :one
INSERT INTO refresh_tokens (refresh_token, expires_at, user_id)
VALUES ($1, $2, $3)
RETURNING *;

-- Получение refresh-токена по ID
-- name: GetRefreshTokenByID :one
SELECT *
FROM refresh_tokens
WHERE id = $1;

-- Получение всех refresh-токенов пользователя
-- name: ListRefreshTokensByUser :many
SELECT *
FROM refresh_tokens
WHERE user_id = $1
order by created_at desc;

-- Обновление refresh-токена
-- name: UpdateRefreshToken :exec
UPDATE refresh_tokens
SET refresh_token = $2,
    expires_at    = $3,
    updated_at    = now()
WHERE id = $1;

-- Удаление refresh-токена (мягкое удаление)
-- name: SoftDeleteRefreshToken :exec
UPDATE refresh_tokens
SET deleted_at = now(),
    updated_at = now()
WHERE id = $1;

-- Полное удаление refresh-токена
-- name: DeleteRefreshToken :exec
DELETE
FROM refresh_tokens
WHERE id = $1;

-- name: CreateRecord :one
WITH inserted AS (
    INSERT INTO records (amount, comment, timestamp, category_id, tag_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *)
SELECT inserted.*, c.type as type
FROM inserted
         JOIN categories c ON c.id = inserted.category_id;;

-- name: GetRecordByID :one
SELECT r.*, c.type as type
FROM records as r
         join categories as c on r.category_id = c.id
WHERE r.id = $1
  and r.deleted_at is null;

-- name: GetRecordByIDAndUserID :one
SELECT r.*, c.type as type
FROM records as r
         join categories as c on r.category_id = c.id
WHERE r.id = $1
  and r.deleted_at is null
  and c.deleted_at is null
  and c.user_id = $2;

-- name: ListRecordByUserID :many
SELECT r.*, c.type as type
FROM records as r
         join categories as c on r.category_id = c.id
WHERE c.user_id = $1
  and r.deleted_at is null
  and c.deleted_at is null
order by timestamp desc;

-- name: ListRecordsByCategory :many
SELECT r.*, c.type as type
FROM records as r
         join categories as c on r.category_id = c.id
WHERE r.category_id = $1
  and c.deleted_at is null;

-- name: UpdateRecord :one
WITH updated AS (
    UPDATE records
        SET amount = $1,
            comment = $2,
            timestamp = $3,
            category_id = $4,
            tag_id = $5,
            updated_at = now()
        WHERE records.id = $6
        RETURNING *)
SELECT u.*, c.type as type
FROM updated u
         JOIN categories c ON c.id = u.category_id;

-- name: SoftDeleteRecord :one
UPDATE records
SET deleted_at = now(),
    updated_at = now()
from categories as c
WHERE c.id = records.category_id
  and records.id = $1
  and c.user_id = $2
returning records.*, c.type as type;

-- name: DeleteRecord :one
with deleted as ( DELETE
    FROM records
        WHERE records.id = $1
        returning *)
SELECT d.*, c.type as type
FROM deleted d
         JOIN categories c ON c.id = d.category_id;;
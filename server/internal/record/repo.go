package record

import (
	"budget/internal/db/sqlc/budget"
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"reflect"
)

type Repo struct {
	db *pgxpool.Pool
	q  *budget.Queries
}

func NewRecordsRepo(db *pgxpool.Pool) *Repo {
	return &Repo{
		db: db,
		q:  budget.New(db),
	}
}

// Create создает новую запись
func (r *Repo) Create(ctx context.Context, params budget.CreateRecordParams) (RecordResponseDto, error) {
	record, err := r.q.CreateRecord(ctx, params)
	if err != nil {
		return RecordResponseDto{}, fmt.Errorf("failed to create record: %w", err)
	}
	return convertToResponseDto(record), nil
}

// CreateMany создает несколько новых записей
func (r *Repo) CreateMany(ctx context.Context, list []budget.CreateRecordParams) ([]RecordResponseDto, error) {
	result := make([]RecordResponseDto, len(list))
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return result, fmt.Errorf("unable to begin transaction: %w", err)
	}
	qtx := r.q.WithTx(tx)

	for i, item := range list {
		record, err := qtx.CreateRecord(ctx, item)
		if err != nil {
			_ = tx.Rollback(ctx)
			return result, fmt.Errorf("transaction failed: %w", err)
		}
		result[i] = convertToResponseDto(record)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return result, fmt.Errorf("unable to commit transaction: %w", err)
	}
	return result, nil
}

// GetByID получает запись по ID
func (r *Repo) GetByID(ctx context.Context, id int64) (RecordResponseDto, error) {
	record, err := r.q.GetRecordByID(ctx, id)
	if err != nil {
		return RecordResponseDto{}, fmt.Errorf("failed to get record by ID: %w", err)
	}
	return convertToResponseDto(record), nil
}

// GetByIDAndUserID получает запись по ID и UserID
func (r *Repo) GetByIDAndUserID(ctx context.Context, id int64, userId int32) (RecordResponseDto, error) {
	record, err := r.q.GetRecordByIDAndUserID(ctx, budget.GetRecordByIDAndUserIDParams{
		ID:     id,
		UserID: userId,
	})
	if err != nil {
		return RecordResponseDto{}, fmt.Errorf("failed to get record by ID and UserID: %w", err)
	}
	return convertToResponseDto(record), nil
}

// List возвращает все записи для указанного пользователя
func (r *Repo) List(ctx context.Context, userId int32) ([]RecordResponseDto, error) {
	records, err := r.q.ListRecordByUserID(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to list records by UserID: %w", err)
	}

	result := make([]RecordResponseDto, len(records))
	for i, record := range records {
		result[i] = convertToResponseDto(record)
	}
	return result, nil
}

// ListByCategory возвращает все записи в указанной категории
func (r *Repo) ListByCategory(ctx context.Context, categoryID int64) ([]RecordResponseDto, error) {
	records, err := r.q.ListRecordsByCategory(ctx, categoryID)
	if err != nil {
		return nil, fmt.Errorf("failed to list records by category: %w", err)
	}

	result := make([]RecordResponseDto, len(records))
	for i, record := range records {
		result[i] = convertToResponseDto(record)
	}
	return result, nil
}

// Update обновляет запись
func (r *Repo) Update(ctx context.Context, params budget.UpdateRecordParams) (RecordResponseDto, error) {
	record, err := r.q.UpdateRecord(ctx, params)
	if err != nil {
		return RecordResponseDto{}, err
	}
	return convertToResponseDto(record), nil
}

// SoftDelete выполняет мягкое удаление записи
func (r *Repo) SoftDelete(ctx context.Context, id int64, userId int32) (RecordResponseDto, error) {
	record, err := r.q.SoftDeleteRecord(ctx, budget.SoftDeleteRecordParams{
		ID:     id,
		UserID: userId,
	})
	if err != nil {
		return RecordResponseDto{}, err
	}
	return convertToResponseDto(record), nil
}

// Delete полностью удаляет запись
func (r *Repo) Delete(ctx context.Context, id int64) (RecordResponseDto, error) {
	record, err := r.q.DeleteRecord(ctx, id)
	if err != nil {
		return RecordResponseDto{}, err
	}

	return convertToResponseDto(record), nil
}

func convertToResponseDto(input any) RecordResponseDto {
	inVal := reflect.ValueOf(input)
	outVal := reflect.New(reflect.TypeOf(RecordResponseDto{})).Elem()

	for i := 0; i < outVal.NumField(); i++ {
		fieldName := outVal.Type().Field(i).Name
		inField := inVal.FieldByName(fieldName)
		if inField.IsValid() && inField.Type() == outVal.Field(i).Type() {
			outVal.Field(i).Set(inField)
		}
	}

	return outVal.Interface().(RecordResponseDto)
}

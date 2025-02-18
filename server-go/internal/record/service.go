package record

import (
	"budget/internal/cache"
	"budget/internal/category"
	"budget/internal/db/sqlc/budget"
	http_error "budget/internal/http-error"
	"budget/internal/ws"
	"budget/pkg/utils/convert"
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/samber/lo"
	"time"
)

type Service struct {
	recordRepo   *Repo
	categoryRepo *category.Repo
	cud          *ws.CudService[ResponseDto]
	cache        cache.Cache
}

func NewService(db *pgxpool.Pool, c cache.Cache) *Service {
	recordRepo := NewRecordsRepo(db)
	categoryRepo := category.NewCategoryRepo(db)
	cudService := ws.NewCudService[ResponseDto]("record")
	return &Service{
		recordRepo,
		categoryRepo,
		cudService,
		c,
	}
}

func (s Service) GetAll(userId int32) (response []ResponseDto, cache string, err error) {
	cacheKey := s.getCacheKey(userId)
	if data, found := s.cache.Get(cacheKey); found {
		return nil, data, nil
	}

	ctx := context.Background()
	list, err := s.recordRepo.List(ctx, userId)
	if err != nil {
		return []ResponseDto{}, "", http_error.NewInternalRequestError("")
	}

	marshal, err := json.Marshal(list)
	if err != nil {
		return nil, "", http_error.NewInternalRequestError("failed to marshal list")
	}
	jsonString := string(marshal)

	s.cache.Set(cacheKey, jsonString)

	return list, jsonString, nil
}

func (s Service) FindOne(userId int32, id int64) (ResponseDto, error) {
	ctx := context.Background()
	record, err := s.recordRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return record, http_error.NewNotFoundError("Record not found", "")
	}

	return record, nil
}

func (s Service) CreateOne(userId int32, dto CreateOneRecordRequestDto) (ResponseDto, error) {
	s.dropCache(userId)

	ctx := context.Background()
	_, err := s.categoryRepo.GetByIDAndUserID(ctx, dto.CategoryID, userId)
	if err != nil {
		return ResponseDto{}, http_error.NewBadRequestError("Category not found", "")
	}

	newRecord, err := s.recordRepo.Create(ctx, budget.CreateRecordParams{
		Amount:     convert.Float64ToNumeric(dto.Amount, 2),
		Comment:    dto.Comment,
		Timestamp:  pgtype.Timestamp{Time: dto.Timestamp, Valid: true},
		CategoryID: dto.CategoryID,
	})
	if err != nil {
		return newRecord, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "create", newRecord)

	return newRecord, nil
}

func (s Service) CreateMany(userId int32, dto CreateManyRecordsRequestDto) ([]ResponseDto, error) {
	s.dropCache(userId)

	categoryIds := lo.Map[CreateOneRecordRequestDto, int64](dto.Data, func(item CreateOneRecordRequestDto, _ int) int64 {
		return item.CategoryID
	})
	categoryIds = lo.Uniq(categoryIds)

	ctx := context.Background()
	categories, err := s.categoryRepo.GetByIDAndUserIDs(ctx, categoryIds, userId)
	if err != nil {
		return nil, http_error.NewInternalRequestError("")
	}
	if len(categories) != len(categoryIds) {
		return nil, http_error.NewBadRequestError("Invalid category ids", "")
	}

	categoriesMap := make(map[int64]category.ResponseDto)
	for _, categoryEntity := range categories {
		categoriesMap[categoryEntity.ID] = categoryEntity
	}

	newRecords := make([]budget.CreateRecordParams, len(dto.Data))
	for i, item := range dto.Data {
		record := budget.CreateRecordParams{
			Amount:     convert.Float64ToNumeric(item.Amount, 2),
			Comment:    item.Comment,
			CategoryID: item.CategoryID,
			Timestamp: pgtype.Timestamp{
				Time:  item.Timestamp,
				Valid: true,
			},
		}
		newRecords[i] = record
	}

	many, err := s.recordRepo.CreateMany(ctx, newRecords)
	if err != nil {
		return nil, http_error.NewInternalRequestError("")
	}

	s.cud.SendMany(userId, "create", many)

	return many, nil
}

func (s Service) UpdateOne(userId int32, dto UpdateOneRecordRequestDto) (ResponseDto, error) {
	s.dropCache(userId)

	ctx := context.Background()

	_, err := s.FindOne(userId, dto.ID)
	if err != nil {
		return ResponseDto{}, err
	}

	_, err = s.categoryRepo.GetByIDAndUserID(ctx, dto.CategoryID, userId)
	if err != nil {
		return ResponseDto{}, http_error.NewBadRequestError("Category not found", "")
	}

	record := budget.UpdateRecordParams{
		ID:         dto.ID,
		Amount:     convert.Float64ToNumeric(dto.Amount, 2),
		Comment:    dto.Comment,
		CategoryID: dto.CategoryID,
		Timestamp: pgtype.Timestamp{
			Time:  dto.Timestamp,
			Valid: true,
		},
	}

	updated, err := s.recordRepo.Update(ctx, record)
	if err != nil {
		return ResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "update", updated)

	return updated, nil
}

func (s Service) DeleteOne(userId int32, id int64) (ResponseDto, error) {
	s.dropCache(userId)

	_, err := s.FindOne(userId, id)
	if err != nil {
		return ResponseDto{}, err
	}

	ctx := context.Background()

	deleted, err := s.recordRepo.SoftDelete(ctx, id, userId)
	if err != nil {
		return ResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "delete", deleted)

	return deleted, nil
}

func (s Service) Adjustment(userId int32, dto AdjustmentRequestDto) (ResponseDto, error) {
	s.dropCache(userId)

	ctx := context.Background()
	adjustmentCategory, err := s.categoryRepo.GetAdjustmentUserID(ctx, userId)
	if err != nil {
		return ResponseDto{}, http_error.NewInternalRequestError("")
	}

	record := budget.CreateRecordParams{
		Amount:     convert.Float64ToNumeric(dto.Diff, 2),
		CategoryID: adjustmentCategory.ID,
		Timestamp: pgtype.Timestamp{
			Time:  time.Now(),
			Valid: true,
		},
	}

	newRecord, err := s.recordRepo.Create(ctx, record)
	if err != nil {
		return ResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "create", newRecord)

	return newRecord, nil
}

func (s Service) getCacheKey(id int32) string {
	return fmt.Sprintf("user:%d:records", id)
}

func (s Service) dropCache(userId int32) {
	key := s.getCacheKey(userId)
	s.cache.Del(key)
}

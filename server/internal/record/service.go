package record

import (
	"budget/internal/cache"
	"budget/internal/category"
	"budget/internal/db"
	http_error "budget/internal/http-error"
	"budget/internal/ws"
	"budget/pkg/utils/convert"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/samber/lo"
)

type Service struct {
	recordRepo   *Repo
	categoryRepo *category.Repo
	cud          *ws.CudService[RecordResponseDto]
	cache        cache.Cache
}

func NewService(recordRepo *Repo, categoryRepo *category.Repo) *Service {
	cudService := ws.NewCudService[RecordResponseDto]("record")
	cacheService, _ := cache.NewService()
	return &Service{
		recordRepo,
		categoryRepo,
		cudService,
		cacheService,
	}
}

func (s Service) GetAll(ctx context.Context, userId int32) (response []RecordResponseDto, cache string, err error) {
	cacheKey := s.getCacheKey(userId)
	if data, found := s.cache.Get(cacheKey); found {
		return nil, data, nil
	}

	list, err := s.recordRepo.List(ctx, userId)
	if err != nil {
		return []RecordResponseDto{}, "", http_error.NewInternalRequestError("")
	}

	marshal, err := json.Marshal(list)
	if err != nil {
		return nil, "", http_error.NewInternalRequestError("failed to marshal list")
	}
	jsonString := string(marshal)

	s.cache.Set(cacheKey, jsonString)

	return list, jsonString, nil
}

func (s Service) FindOne(ctx context.Context, userId int32, id int64) (RecordResponseDto, error) {
	record, err := s.recordRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return record, http_error.NewNotFoundError("Record not found", "")
	}

	return record, nil
}

func (s Service) CreateOne(ctx context.Context, userId int32, dto CreateOneRecordRequestDto) (RecordResponseDto, error) {
	s.dropCache(userId)

	_, err := s.categoryRepo.GetByIDAndUserID(ctx, dto.CategoryID, userId)
	if err != nil {
		return RecordResponseDto{}, http_error.NewBadRequestError("Category not found", "")
	}

	err = s.validateCategoryTag(ctx, dto.CategoryID, dto.TagID)
	if err != nil {
		return RecordResponseDto{}, err
	}

	newRecordParams := db.CreateRecordParams{
		Amount:     convert.Float64ToNumeric(dto.Amount, 2),
		Comment:    dto.Comment,
		Timestamp:  pgtype.Timestamp{Time: dto.Timestamp, Valid: true},
		CategoryID: dto.CategoryID,
	}
	if dto.TagID > 0 {
		newRecordParams.TagID = pgtype.Int8{
			Int64: dto.TagID,
			Valid: true,
		}
	}
	newRecord, err := s.recordRepo.Create(ctx, newRecordParams)
	fmt.Println("tagid", dto.TagID)

	if err != nil {
		return newRecord, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "create", newRecord)

	return newRecord, nil
}

func (s Service) CreateMany(ctx context.Context, userId int32, dto CreateManyRecordsRequestDto) ([]RecordResponseDto, error) {
	s.dropCache(userId)

	categoryIds := lo.Map[CreateOneRecordRequestDto, int64](dto.Data, func(item CreateOneRecordRequestDto, _ int) int64 {
		return item.CategoryID
	})
	categoryIds = lo.Uniq(categoryIds)

	categories, err := s.categoryRepo.GetByIDAndUserIDs(ctx, categoryIds, userId)
	if err != nil {
		return nil, http_error.NewInternalRequestError("")
	}
	if len(categories) != len(categoryIds) {
		return nil, http_error.NewBadRequestError("Invalid category ids", "")
	}

	categoriesMap := make(map[int64]db.Category)
	for _, categoryEntity := range categories {
		categoriesMap[categoryEntity.ID] = categoryEntity
	}

	newRecords := make([]db.CreateRecordParams, len(dto.Data))
	for i, item := range dto.Data {
		err := s.validateCategoryTag(ctx, item.CategoryID, item.TagID)
		if err != nil {
			return nil, err
		}

		record := db.CreateRecordParams{
			Amount:     convert.Float64ToNumeric(item.Amount, 2),
			Comment:    item.Comment,
			CategoryID: item.CategoryID,
			Timestamp: pgtype.Timestamp{
				Time:  item.Timestamp,
				Valid: true,
			},
		}
		if item.TagID > 0 {
			record.TagID = pgtype.Int8{
				Int64: item.TagID,
				Valid: true,
			}
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

func (s Service) UpdateOne(ctx context.Context, userId int32, dto UpdateOneRecordRequestDto) (RecordResponseDto, error) {
	s.dropCache(userId)

	_, err := s.FindOne(ctx, userId, dto.ID)
	if err != nil {
		return RecordResponseDto{}, err
	}

	_, err = s.categoryRepo.GetByIDAndUserID(ctx, dto.CategoryID, userId)
	if err != nil {
		return RecordResponseDto{}, http_error.NewBadRequestError("Category not found", "")
	}

	err = s.validateCategoryTag(ctx, dto.CategoryID, dto.TagID)
	if err != nil {
		return RecordResponseDto{}, err
	}

	record := db.UpdateRecordParams{
		ID:         dto.ID,
		Amount:     convert.Float64ToNumeric(dto.Amount, 2),
		Comment:    dto.Comment,
		CategoryID: dto.CategoryID,
		Timestamp: pgtype.Timestamp{
			Time:  dto.Timestamp,
			Valid: true,
		},
	}
	if dto.TagID > 0 {
		record.TagID = pgtype.Int8{
			Int64: dto.TagID,
			Valid: true,
		}
	}

	updated, err := s.recordRepo.Update(ctx, record)
	if err != nil {
		return RecordResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "update", updated)

	return updated, nil
}

func (s Service) DeleteOne(ctx context.Context, userId int32, id int64) (RecordResponseDto, error) {
	s.dropCache(userId)

	_, err := s.FindOne(ctx, userId, id)
	if err != nil {
		return RecordResponseDto{}, err
	}

	deleted, err := s.recordRepo.SoftDelete(ctx, id, userId)
	if err != nil {
		return RecordResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "delete", deleted)

	return deleted, nil
}

func (s Service) Adjustment(ctx context.Context, userId int32, dto AdjustmentRequestDto) (RecordResponseDto, error) {
	s.dropCache(userId)

	adjustmentCategory, err := s.categoryRepo.GetAdjustmentUserID(ctx, userId)
	if err != nil {
		return RecordResponseDto{}, http_error.NewInternalRequestError("")
	}

	record := db.CreateRecordParams{
		Amount:     convert.Float64ToNumeric(dto.Diff, 2),
		CategoryID: adjustmentCategory.ID,
		Timestamp: pgtype.Timestamp{
			Time:  time.Now(),
			Valid: true,
		},
	}

	newRecord, err := s.recordRepo.Create(ctx, record)
	if err != nil {
		return RecordResponseDto{}, http_error.NewInternalRequestError("")
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

func (s Service) validateCategoryTag(ctx context.Context, categoryId int64, tagId int64) error {
	if tagId == 0 {
		return nil
	}

	userTags, err := s.categoryRepo.GetTagsIdsByCategoryId(ctx, categoryId)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return http_error.NewInternalRequestError("")
		}

		return http_error.NewBadRequestError("category has no tags", "")
	}

	for _, userTag := range userTags {
		if userTag.TagID == tagId {
			return nil
		}
	}

	return http_error.NewBadRequestError("invalid tag id", "")
}

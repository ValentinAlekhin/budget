package category

import (
	"budget/internal/db"
	http_error "budget/internal/http-error"
	"budget/internal/tag"
	"budget/internal/ws"
	"budget/pkg/utils/convert"
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	categoryRepo *Repo
	tagRepo      *tag.Repo
	cud          *ws.CudService[CategoryResponseDto]
}

func NewService(categoryRepo *Repo, tagRepo *tag.Repo) *Service {
	cudService := ws.NewCudService[CategoryResponseDto]("category")
	return &Service{categoryRepo: categoryRepo, tagRepo: tagRepo, cud: cudService}
}

func (s Service) GetAll(ctx context.Context, userId int32) []CategoryResponseDto {
	categories, err := s.categoryRepo.ListByUser(ctx, userId)
	if err != nil {
		return []CategoryResponseDto{}
	}

	ids := make([]int64, 0, len(categories))
	for _, category := range categories {
		ids = append(ids, category.ID)
	}
	categoryTags, err := s.categoryRepo.GetTagsIdsByCategoryIds(ctx, ids)
	if err != nil {
		return []CategoryResponseDto{}
	}

	dto := s.toManyDto(categories, categoryTags)

	return dto
}

func (s Service) FindOne(ctx context.Context, userId int32, id int64) (CategoryResponseDto, error) {
	category, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	categoryTags, err := s.categoryRepo.GetTagsIdsByCategoryId(ctx, id)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return CategoryResponseDto{}, http_error.NewInternalRequestError("")
		}
	}

	dto := s.toDto(category, categoryTags)

	return dto, nil
}

func (s Service) CreateOne(ctx context.Context, dto CreateCategoryRequestDto, userId int32) (CategoryResponseDto, error) {
	err := s.validateCategoryTags(ctx, userId, dto.TagIds)
	if err != nil {
		return CategoryResponseDto{}, err
	}

	newCategory := db.CreateCategoryParams{
		Name:       dto.Name,
		Type:       dto.Type,
		Order:      dto.Order,
		Plan:       convert.Float64ToNumeric(dto.Plan, 2),
		PlanPeriod: dto.PlanPeriod,
		Color:      dto.Color,
		Icon:       dto.Icon,
		Comment:    dto.Comment,
		UserID:     userId,
	}

	category, tags, err := s.categoryRepo.Create(ctx, newCategory, dto.TagIds)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewInternalRequestError("")
	}

	responseDto := s.toDto(category, tags)

	s.cud.SendOne(userId, "create", responseDto)

	return responseDto, nil
}

func (s Service) UpdateOne(ctx context.Context, dto UpdateCategoryRequestDto, id int64, userId int32) (CategoryResponseDto, error) {
	_, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	err = s.validateCategoryTags(ctx, userId, dto.TagIds)
	if err != nil {
		return CategoryResponseDto{}, err
	}

	newCategory := db.UpdateCategoryParams{
		ID:         id,
		Name:       dto.Name,
		Type:       dto.Type,
		Order:      dto.Order,
		Plan:       convert.Float64ToNumeric(dto.Plan, 2),
		PlanPeriod: dto.PlanPeriod,
		Color:      dto.Color,
		Icon:       dto.Icon,
		Comment:    dto.Comment,
		UserID:     userId,
	}

	category, categoryTags, err := s.categoryRepo.Update(ctx, newCategory, dto.TagIds)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewInternalRequestError("")
	}

	responseDto := s.toDto(category, categoryTags)

	s.cud.SendOne(userId, "update", responseDto)

	return responseDto, nil
}

func (s Service) UpdateManyOrder(ctx context.Context, dto UpdateManyCategoryOrderRequestDto, userId int32) ([]CategoryResponseDto, error) {
	categories := make([]db.UpdateCategoryOrderParams, len(dto.Data))
	for i, item := range dto.Data {
		category := db.UpdateCategoryOrderParams{
			ID:     item.ID,
			Order:  item.Order,
			UserID: userId,
		}
		categories[i] = category
	}

	many, err := s.categoryRepo.UpdateManyOrder(ctx, categories)
	if err != nil {
		return []CategoryResponseDto{}, http_error.NewInternalRequestError("")
	}

	categoryIds := make([]int64, 0, len(many))
	for _, category := range many {
		categoryIds = append(categoryIds, category.ID)
	}
	categoryTags, err := s.categoryRepo.GetTagsIdsByCategoryIds(ctx, categoryIds)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return []CategoryResponseDto{}, http_error.NewInternalRequestError("")
		}
	}
	responseDto := s.toManyDto(many, categoryTags)
	s.cud.SendMany(userId, "update", responseDto)

	return responseDto, nil
}

func (s Service) DeleteOne(ctx context.Context, id int64, userId int32) (CategoryResponseDto, error) {
	category, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	_, err = s.categoryRepo.SoftDelete(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewInternalRequestError("")
	}

	tags, _ := s.categoryRepo.GetTagsIdsByCategoryId(ctx, id)
	dto := s.toDto(category, tags)
	s.cud.SendOne(userId, "delete", dto)

	return dto, nil
}

func (s Service) validateCategoryTags(ctx context.Context, userId int32, tagIds []int64) error {
	if tagIds == nil {
		return nil
	}

	if len(tagIds) == 0 {
		return nil
	}

	userTags, err := s.tagRepo.GetByIDsAndUser(ctx, db.GetTagsByIDsAndUserParams{UserID: userId, Column2: tagIds})
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return http_error.NewInternalRequestError("")
		}

		if len(userTags) < len(tagIds) {
			return http_error.NewBadRequestError("invalid tags id", "")
		}
	}

	userTagsMap := make(map[int64]struct{}, len(userTags))
	for _, userTag := range userTags {
		userTagsMap[userTag.ID] = struct{}{}
	}

	for _, tagId := range tagIds {
		if _, ok := userTagsMap[tagId]; !ok {
			return http_error.NewBadRequestError("invalid tags id", "")
		}
	}

	return nil
}

func (s Service) toDto(c db.Category, tags []db.CategoryTag) CategoryResponseDto {
	tagIds := make([]int64, 0, len(tags))
	for _, categoryTag := range tags {
		tagIds = append(tagIds, categoryTag.TagID)
	}

	return CategoryResponseDto{
		ID:         c.ID,
		CreatedAt:  c.CreatedAt,
		UpdatedAt:  c.UpdatedAt,
		Name:       c.Name,
		Type:       c.Type,
		Order:      c.Order,
		Comment:    c.Comment,
		UserID:     c.UserID,
		DeletedAt:  c.DeletedAt,
		Icon:       c.Icon,
		Plan:       c.Plan,
		Color:      c.Color,
		PlanPeriod: c.PlanPeriod,
		TagIds:     tagIds,
	}
}

func (s Service) toManyDto(categories []db.Category, tags []db.CategoryTag) []CategoryResponseDto {
	result := make([]CategoryResponseDto, 0, len(categories))

	for _, category := range categories {
		currentTags := make([]db.CategoryTag, 0, len(tags))
		for _, categoryTag := range tags {
			if categoryTag.CategoryID != category.ID {
				continue
			}
			currentTags = append(currentTags, categoryTag)
		}
		dto := s.toDto(category, currentTags)
		result = append(result, dto)
	}

	return result
}

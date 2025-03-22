package category

import (
	"budget/internal/db/sqlc/budget"
	http_error "budget/internal/http-error"
	"budget/internal/ws"
	"budget/pkg/utils/convert"
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	categoryRepo *Repo
	cud          *ws.CudService[CategoryResponseDto]
}

func NewService(db *pgxpool.Pool) *Service {
	categoryRepo := NewCategoryRepo(db)
	cudService := ws.NewCudService[CategoryResponseDto]("category")
	return &Service{categoryRepo: categoryRepo, cud: cudService}
}

func (s Service) GetAll(ctx context.Context, userId int32) []CategoryResponseDto {
	categories, err := s.categoryRepo.ListByUser(ctx, userId)
	if err != nil {
		return []CategoryResponseDto{}
	}

	return categories
}

func (s Service) FindOne(ctx context.Context, userId int32, id int64) (CategoryResponseDto, error) {
	category, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	return category, nil
}

func (s Service) CreateOne(ctx context.Context, dto CreateCategoryRequestDto, userId int32) (CategoryResponseDto, error) {
	newCategory := budget.CreateCategoryParams{
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

	category, err := s.categoryRepo.Create(ctx, newCategory)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "create", category)

	return category, nil
}

func (s Service) UpdateOne(ctx context.Context, dto UpdateCategoryRequestDto, id int64, userId int32) (CategoryResponseDto, error) {
	_, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return CategoryResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	category := budget.UpdateCategoryParams{
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

	one, err := s.categoryRepo.UpdateOne(ctx, category)
	if err != nil {
		return one, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "update", one)

	return one, nil
}

func (s Service) UpdateManyOrder(ctx context.Context, dto UpdateManyCategoryOrderRequestDto, userId int32) ([]CategoryResponseDto, error) {
	categories := make([]budget.UpdateCategoryOrderParams, len(dto.Data))
	for i, item := range dto.Data {
		category := budget.UpdateCategoryOrderParams{
			ID:     item.ID,
			Order:  item.Order,
			UserID: userId,
		}
		categories[i] = category
	}

	many, err := s.categoryRepo.UpdateManyOrder(ctx, categories)
	if err != nil {
		return many, http_error.NewInternalRequestError("")
	}

	s.cud.SendMany(userId, "update", many)

	return many, nil
}

func (s Service) UpdateMany(ctx context.Context, dto UpdateManyCategoryRequestDto, userId int32) ([]CategoryResponseDto, error) {

	categories := make([]budget.UpdateCategoryParams, len(dto.Data))
	for i, item := range dto.Data {
		category := budget.UpdateCategoryParams{
			ID:         item.ID,
			Name:       item.Name,
			Type:       item.Type,
			Order:      item.Order,
			Plan:       convert.Float64ToNumeric(item.Plan, 2),
			PlanPeriod: item.PlanPeriod,
			Color:      item.Color,
			Icon:       item.Icon,
			Comment:    item.Comment,
			UserID:     userId,
		}
		categories[i] = category
	}

	many, err := s.categoryRepo.UpdateMany(ctx, categories)
	if err != nil {
		return many, http_error.NewInternalRequestError("")
	}

	s.cud.SendMany(userId, "update", many)

	return many, nil
}

func (s Service) DeleteOne(ctx context.Context, id int64, userId int32) (CategoryResponseDto, error) {
	category, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return category, http_error.NewNotFoundError("Category not found", "")
	}

	_, err = s.categoryRepo.SoftDelete(ctx, id, userId)
	if err != nil {
		return category, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "delete", category)

	return category, nil
}

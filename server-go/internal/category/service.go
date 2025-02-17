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
	cud          *ws.CudService[ResponseDto]
}

func NewService(db *pgxpool.Pool) *Service {
	categoryRepo := NewCategoryRepo(db)
	cudService := ws.NewCudService[ResponseDto]("category")
	return &Service{categoryRepo: categoryRepo, cud: cudService}
}

func (s Service) GetAll(userId int32) []ResponseDto {
	ctx := context.Background()
	categories, err := s.categoryRepo.ListByUser(ctx, userId)
	if err != nil {
		return []ResponseDto{}
	}

	return categories
}

func (s Service) FindOne(userId int32, id int64) (ResponseDto, error) {
	ctx := context.Background()
	category, err := s.categoryRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		return ResponseDto{}, http_error.NewNotFoundError("Category not found", "")
	}

	return category, nil
}

func (s Service) CreateOne(dto CreateCategoryRequestDto, userId int32) (ResponseDto, error) {
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

	ctx := context.Background()
	category, err := s.categoryRepo.Create(ctx, newCategory)
	if err != nil {
		return ResponseDto{}, http_error.NewInternalRequestError("")
	}

	s.cud.SendOne(userId, "create", category)

	return category, nil
}

func (s Service) UpdateMany(dto UpdateManyCategoryRequestDto, userId int32) ([]ResponseDto, error) {

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

	ctx := context.Background()
	many, err := s.categoryRepo.UpdateMany(ctx, categories)
	if err != nil {
		return many, http_error.NewInternalRequestError("")
	}

	s.cud.SendMany(userId, "update", many)

	return many, nil
}

func (s Service) DeleteOne(id int64, userId int32) (ResponseDto, error) {
	ctx := context.Background()

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

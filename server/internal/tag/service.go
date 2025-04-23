package tag

import (
	"budget/internal/db"
	http_error "budget/internal/http-error"
	"budget/internal/ws"
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	tagRepo *Repo
	cud     *ws.CudService[TagResponseDto]
}

func NewService(tagRepo *Repo) *Service {
	cudService := ws.NewCudService[TagResponseDto]("tag")
	return &Service{tagRepo: tagRepo, cud: cudService}
}

func (s Service) GetAll(ctx context.Context, userId int32) ([]TagResponseDto, error) {
	tags, err := s.tagRepo.ListByUserID(ctx, userId)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return []TagResponseDto{}, http_error.NewInternalRequestError("")
		}
	}

	return s.toManyDto(tags), nil
}

func (s Service) Create(ctx context.Context, dto CreateTagRequestDto, userId int32) (TagResponseDto, error) {
	tagWithSameName, err := s.tagRepo.GetTagByAndNameAndUserID(ctx, userId, dto.Name)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return TagResponseDto{}, http_error.NewInternalRequestError("")
		}
	}

	if tagWithSameName.ID != 0 {
		return TagResponseDto{}, http_error.NewBadRequestError("invalid tag name", "")
	}

	newTag := db.CreateTagParams{
		Name:   dto.Name,
		Color:  dto.Color,
		Icon:   dto.Icon,
		UserID: userId,
	}
	tag, err := s.tagRepo.Create(ctx, newTag)
	if err != nil {
		fmt.Println(err)
		return TagResponseDto{}, http_error.NewInternalRequestError("")
	}

	responseDto := s.toDto(tag)
	s.cud.SendOne(userId, "create", responseDto)

	return responseDto, nil
}

func (s Service) Update(ctx context.Context, id int64, dto UpdateTagRequestDto, userId int32) (TagResponseDto, error) {
	tagWithSameName, err := s.tagRepo.GetTagByNotIDAndNameAndUserID(ctx, id, userId, dto.Name)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return TagResponseDto{}, http_error.NewInternalRequestError("")
		}
	}

	if tagWithSameName.ID != 0 {
		return TagResponseDto{}, http_error.NewBadRequestError("invalid tag name", "")
	}

	tag, err := s.tagRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return TagResponseDto{}, http_error.NewNotFoundError("tag not found", "")
		}

		return TagResponseDto{}, http_error.NewInternalRequestError("")
	}

	newTag := db.UpdateTagParams{
		ID:    id,
		Name:  dto.Name,
		Color: dto.Color,
		Icon:  dto.Icon,
	}
	tag, err = s.tagRepo.Update(ctx, newTag)
	if err != nil {
		return TagResponseDto{}, http_error.NewInternalRequestError("")
	}

	responseDto := s.toDto(tag)
	s.cud.SendOne(userId, "update", responseDto)

	return responseDto, nil
}

func (s Service) Delete(ctx context.Context, id int64, userId int32) (TagResponseDto, error) {
	tag, err := s.tagRepo.GetByIDAndUserID(ctx, id, userId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return TagResponseDto{}, http_error.NewNotFoundError("tag not found", "")
		}

		return TagResponseDto{}, http_error.NewInternalRequestError("")
	}

	tag, err = s.tagRepo.Delete(ctx, id)

	responseDto := s.toDto(tag)
	s.cud.SendOne(userId, "update", responseDto)

	return responseDto, nil
}

func (s Service) toDto(tag db.Tag) TagResponseDto {
	return TagResponseDto{
		ID:        tag.ID,
		CreatedAt: tag.CreatedAt,
		UpdatedAt: tag.UpdatedAt,
		DeletedAt: tag.DeletedAt,
		Icon:      tag.Icon,
		Color:     tag.Color,
		Name:      tag.Name,
	}
}

func (s Service) toManyDto(tags []db.Tag) []TagResponseDto {
	dtoList := make([]TagResponseDto, 0, len(tags))
	for _, tag := range tags {
		dtoList = append(dtoList, s.toDto(tag))
	}
	return dtoList
}

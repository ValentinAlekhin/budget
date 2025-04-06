package user

import (
	"budget/internal/db"
	http_error "budget/internal/http-error"
	"budget/pkg/utils/argon"
	"context"
)

type Service struct {
	userRepo *Repo
}

func NewService(userRepo *Repo) *Service {
	return &Service{userRepo: userRepo}
}

func (s Service) CreateOne(ctx context.Context, dto *CreateUserDto) (ResponseDto, error) {
	user := ResponseDto{}

	count, err := s.userRepo.CountByEmailOrUsername(ctx, db.CountUserByEmailOrUsernameParams{
		Email:    dto.Email,
		Username: dto.Username,
	})
	if err != nil {
		return user, http_error.NewInternalRequestError("")
	}
	if count > 0 {
		return user, http_error.NewBadRequestError("Account taken", "")
	}

	internalErr := http_error.NewInternalRequestError("Internal error")

	hashedPass, err := argon.NewArgon2ID().Hash(dto.Password)
	if err != nil {
		return user, internalErr
	}

	newUser, err := s.userRepo.Create(ctx, db.CreateUserParams{
		Username: dto.Username,
		Email:    dto.Email,
		Password: hashedPass,
	})
	if err != nil {
		return user, internalErr
	}

	return newUser, nil
}

func (s Service) UpdateOne(ctx context.Context) (ResponseDto, error) {
	return ResponseDto{}, nil
}

func (s Service) GetUserById(ctx context.Context, id int32) (ResponseDto, error) {
	user := ResponseDto{}
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return user, http_error.NewNotFoundError("User not found", string(id))
	}

	return user, nil
}

func (s Service) GetUserByEmailAndPass(ctx context.Context, username string, pass string) (ResponseDto, error) {
	user, err := s.userRepo.GetByUsername(ctx, username)
	if err != nil {
		return ResponseDto{}, http_error.NewNotFoundError("User not found", "")
	}

	valid, err := argon.NewArgon2ID().Verify(pass, user.Password)
	if err != nil {
		return user, http_error.NewInternalRequestError("Pass verify")
	}
	if !valid {
		return user, http_error.NewBadRequestError("Invalid credentials", "")
	}

	return user, nil
}

func (s Service) ValidateEmail(ctx context.Context, email string) bool {
	_, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return true
	} else {
		return false
	}
}

func (s Service) ValidateUsername(ctx context.Context, username string) bool {
	_, err := s.userRepo.GetByUsername(ctx, username)
	if err != nil {
		return true
	} else {
		return false
	}
}

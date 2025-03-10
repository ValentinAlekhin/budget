package user

import (
	"budget/internal/db/sqlc/budget"
	http_error "budget/internal/http-error"
	"budget/pkg/utils/argon"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	userRepo *Repo
}

func NewService(db *pgxpool.Pool) *Service {
	userRepo := NewUserRepo(db)

	return &Service{userRepo: userRepo}
}

func (s Service) CreateOne(dto *CreateUserDto) (ResponseDto, error) {
	user := ResponseDto{}
	ctx := context.Background()

	count, err := s.userRepo.CountByEmailOrUsername(ctx, budget.CountUserByEmailOrUsernameParams{
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

	newUser, err := s.userRepo.Create(ctx, budget.CreateUserParams{
		Username: dto.Username,
		Email:    dto.Email,
		Password: hashedPass,
	})
	if err != nil {
		return user, internalErr
	}

	return newUser, nil
}

func (s Service) UpdateOne() (ResponseDto, error) {
	return ResponseDto{}, nil
}

func (s Service) GetUserById(id int32) (ResponseDto, error) {
	user := ResponseDto{}
	ctx := context.Background()
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return user, http_error.NewNotFoundError("User not found", string(id))
	}

	return user, nil
}

func (s Service) GetUserByEmailAndPass(username string, pass string) (ResponseDto, error) {
	ctx := context.Background()

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

func (s Service) ChangePassword(dto ChangePasswordRequestDto, userId int32) error {
	ctx := context.Background()
	user, err := s.userRepo.GetByID(ctx, userId)
	if err != nil {
		return http_error.NewNotFoundError("User not found", string(userId))
	}

	internalErr := http_error.NewInternalRequestError("")

	valid, err := argon.NewArgon2ID().Verify(dto.OldPassword, user.Password)
	if err != nil {
		return internalErr
	}
	if !valid {
		return http_error.NewBadRequestError("Invalid credentials", "")
	}

	hashedPass, err := argon.NewArgon2ID().Hash(dto.NewPassword)
	if err != nil {
		return internalErr
	}

	err = s.userRepo.UpdatePassword(ctx, budget.UpdateUserPasswordParams{ID: userId, Password: hashedPass})
	if err != nil {
		return internalErr
	}

	return nil
}

func (s Service) ValidateEmail(email string) bool {
	ctx := context.Background()
	_, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return true
	} else {
		return false
	}
}

func (s Service) ValidateUsername(username string) bool {
	ctx := context.Background()
	_, err := s.userRepo.GetByUsername(ctx, username)
	if err != nil {
		return true
	} else {
		return false
	}
}

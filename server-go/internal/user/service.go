package user

import (
	db "budget/database"
	"budget/internal/category"
	http_error "budget/internal/http-error"
	"budget/utils/argon"
)

type service struct {
}

func (s service) CreateOne(dto *CreateUserDto) (db.User, error) {
	user := db.User{}

	if res := db.Instance.Where("username = ?", dto.Username).Or("email = ?", dto.Email).First(&user); res.RowsAffected >= 1 {
		return user, http_error.NewBadRequestError("Account taken", "")
	}

	internalErr := http_error.NewInternalRequestError("Internal error")

	hashedPass, err := argon.NewArgon2ID().Hash(dto.Password)
	if err != nil {
		return user, internalErr
	}

	user.Password = hashedPass
	user.Username = dto.Username
	user.Email = dto.Email

	if res := db.Instance.Create(&user); res.Error != nil {
		return user, internalErr
	}

	if err, _ := category.Service.CreateAdjustmentCategory(user.ID); err != nil {
		return user, err
	}

	return user, nil
}

func (s service) UpdateOne() (db.User, error) {
	return db.User{}, nil
}

func (s service) GetUserById(id string) (db.User, error) {
	user := db.User{}
	res := db.Instance.First(&user, "id = ?", id)
	if res.RowsAffected == 0 {
		return user, http_error.NewNotFoundError("User not found", id)
	}

	return user, nil
}

func (s service) GetUserByEmailAndPass(username string, pass string) (db.User, error) {
	user := db.User{Username: username}

	res := db.Instance.Where("username = ?", username).First(&user)
	if res.RowsAffected == 0 {
		return user, http_error.NewNotFoundError("User not found", "")
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

func (s service) ValidateEmail(email string) bool {
	user := db.User{Email: email}

	res := db.Instance.Where("email = ?", email).First(&user)
	if res.RowsAffected == 0 {
		return true
	} else {
		return false
	}
}

func (s service) ValidateUsername(username string) bool {
	user := db.User{Username: username}

	res := db.Instance.Where("username = ?", username).First(&user)
	if res.RowsAffected == 0 {
		return true
	} else {
		return false
	}
}

var Service = service{}

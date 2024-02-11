package user

import (
	db "budget/database"
	"budget/utils/argon"
	"budget/utils/bcrypt"
	"errors"
)

type service struct {
}

func (s service) CreateOne(createUserDto *CreateUserDto) (db.User, error) {
	user := db.User{}

	if res := db.Instance.Where("username = ?", createUserDto.Username).Or("email = ?", createUserDto.Email).First(&user); res.RowsAffected >= 1 {
		return db.User{}, errors.New("account taken")
	}

	hashedPass, err := bcrypt.HashPassword(createUserDto.Password)
	if err != nil {
		return db.User{}, err
	}

	createUserDto.Password = hashedPass
	if res := db.Instance.Create(&createUserDto); res.Error != nil {
		return db.User{}, res.Error
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
		return db.User{}, errors.New("user not found")
	}

	return user, nil
}

func (s service) GetUserByEmailAndPass(username string, pass string) (db.User, error) {
	user := db.User{Username: username}

	res := db.Instance.Where("username = ?", username).First(&user)
	if res.RowsAffected == 0 {
		return db.User{}, errors.New("user not found")
	}

	valid, err := argon.NewArgon2ID().Verify(pass, user.Password)
	if err != nil {
		return db.User{}, errors.New("password validation error")
	}
	if !valid {
		return db.User{}, errors.New("invalid password")
	}

	return user, nil
}

var Service = service{}

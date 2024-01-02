package user

import (
	"budget/database"
	"budget/utils/bcrypt"
	"errors"
)

type service struct {
}

func (s service) CreateOne(createUserDto *CreateUserDto) (User, error) {
	user := User{}

	if res := database.Instance.Where("username = ?", createUserDto.Username).Or("email = ?", createUserDto.Email).First(&user); res.RowsAffected >= 1 {
		return User{}, errors.New("account taken")
	}

	hashedPass, err := bcrypt.HashPassword(createUserDto.Password)
	if err != nil {
		return User{}, err
	}

	createUserDto.Password = hashedPass
	if res := database.Instance.Create(&createUserDto); res.Error != nil {
		return User{}, res.Error
	}

	return user, nil
}

func (s service) UpdateOne() (User, error) {
	return User{}, nil
}

func (s service) GetUserById(id string) (User, error) {
	user := User{}
	res := database.Instance.First(&user, "id = ?", id)
	if res.RowsAffected == 0 {
		return User{}, errors.New("user not found")
	}

	return user, nil
}

func (s service) GetUserByEmailAndPass(email string, pass string) (User, error) {
	user := User{Email: email}

	res := database.Instance.Where("email = ?", email).First(&user)
	if res.RowsAffected == 0 {
		return User{}, errors.New("user not found")
	}

	if err := bcrypt.CheckPasswordHash(pass, user.Password); !err {
		return User{}, errors.New("password not valid")
	}

	return user, nil
}

var Service = service{}

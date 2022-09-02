package category

import (
	db "budget/database"
	"errors"
)

type service struct {
}

func (s service) GetAll(id uint) []Category {
	var categories []Category
	if res := db.Instance.Where("user_id = ?", id).Find(&categories); res.RowsAffected == 0 {
		categories = make([]Category, 0)
	}

	return categories
}

func (s service) CreateOne(dto CreateCategoryRequest, userId uint) (Category, error) {
	category := Category{
		Name:    dto.Name,
		Type:    dto.Type,
		Comment: dto.Comment,
		UserID:  userId,
	}

	if res := db.Instance.Create(&category); res.Error != nil {
		return Category{}, res.Error
	}

	return category, nil
}

func (s service) UpdateOne(dto UpdateCategoryRequest, id uint, userId uint) (Category, error) {
	category, err := s.GetOneById(id, userId)
	if err != nil {
		return Category{}, err
	}

	category.Name = dto.Name
	category.Comment = dto.Comment
	db.Instance.Save(&category)

	return category, nil
}

func (s service) GetOneById(id uint, userId uint) (Category, error) {
	category := Category{
		Model: db.Model{
			ID: id,
		},
		UserID: userId,
	}

	if res := db.Instance.First(&category); res.Error != nil || res.RowsAffected == 0 {
		return Category{}, errors.New("category not found")
	}

	return category, nil
}

func (s service) DeleteOne(id uint, userId uint) (Category, error) {
	category, err := s.GetOneById(id, userId)
	if err != nil {
		return Category{}, err
	}

	db.Instance.Delete(&category)

	return category, nil
}

var Service = service{}

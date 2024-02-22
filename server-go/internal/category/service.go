package category

import (
	db "budget/database"
	http_error "budget/internal/http-error"
)

type service struct {
}

func (s service) GetAll(userId string) []db.Category {
	var categories []db.Category
	db.Instance.Where("user_id = ?", userId).Find(&categories)
	return categories
}

func (s service) FindOne(userId string, id string) (error, db.Category) {
	var category db.Category

	err := http_error.NewNotFoundError("Category not found", "")

	if res := db.Instance.Where("user_id = ?", userId).Where("id = ?", id).First(&category); res.Error != nil || res.RowsAffected == 0 {
		return err, category
	} else {
		return nil, category
	}
}

func (s service) CreateOne(dto CreateCategoryRequestDto, userId string) db.Category {
	newCategory := db.Category{
		Name:       dto.Name,
		Type:       dto.Type,
		Order:      dto.Order,
		Plan:       dto.Plan,
		PlanPeriod: dto.PlanPeriod,
		Color:      dto.Color,
		Icon:       dto.Icon,
		Comment:    dto.Comment,
		UserID:     userId,
	}

	db.Instance.Create(&newCategory)

	return newCategory
}

func (s service) UpdateMany(dto UpdateManyCategoryRequestDto, userId string) (error, []db.Category) {
	tx := db.Instance.Begin()

	categories := make([]db.Category, 0)
	for _, item := range dto.Items {
		category := db.Category{
			Model:      db.Model{ID: item.ID},
			Name:       item.Name,
			Type:       item.Type,
			Order:      item.Order,
			Plan:       item.Plan,
			PlanPeriod: item.PlanPeriod,
			Color:      item.Color,
			Icon:       item.Icon,
			Comment:    item.Comment,
		}

		if res := tx.Model(&category).Where("user_id = ?", userId).Updates(&category); res.Error != nil || res.RowsAffected == 0 {
			tx.Rollback()
			return http_error.NewBadRequestError("Invalid category", item.ID), categories
		}

		categories = append(categories, category)
	}

	tx.Commit()

	return nil, categories
}

func (s service) DeleteOne(id string, userId string) (error, db.Category) {
	if err, category := s.FindOne(userId, id); err != nil {
		return err, category
	} else {
		db.Instance.Delete(&category)
		return nil, category
	}
}

func (s service) CreateAdjustmentCategory(userId string) (error, db.Category) {
	category := db.Category{
		Name:       "Adjustment",
		Type:       db.CategoryTypeAdjustment,
		PlanPeriod: db.PlanPeriodDay,
		Comment:    "Service category",
		UserID:     userId,
	}
	if res := db.Instance.Save(&category); res.Error != nil {
		return http_error.NewInternalRequestError("Error while creating Adjustment"), category
	}
	return nil, category
}

func (s service) GetAdjustmentCategory(userId string) (error, db.Category) {
	category := db.Category{}
	if err := db.Instance.Where("type = ?", db.CategoryTypeAdjustment).Where("user_id = ?", userId).First(&category); err.Error != nil || err.RowsAffected == 0 {
		return s.CreateAdjustmentCategory(userId)
	}
	return nil, category
}

var Service = service{}

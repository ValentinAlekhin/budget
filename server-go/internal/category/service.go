package category

import (
	db "budget/database"
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

var Service = service{}

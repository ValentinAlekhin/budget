package record

import (
	db "budget/database"
)
type service struct {
}

// .Where("user_id = ? AND deleted_at IS NULL", id)

func (s service) GetAll(id string) []Record {
	println(id)
	var records []Record
	if res := db.Instance.Preload("Category").Joins("INNER JOIN categories ON categories.id = records.category_id").Where("categories.user_id = ?", id).Order("timestamp desc").Find(&records);res.RowsAffected == 0 {
		records = make([]Record, 0)
	}

	return records
}

func (s service) CreateOne(user *Record) error {
	return nil
}

func (s service) UpdateOne(user *Record) error {
	return nil
}

var Service = service{}

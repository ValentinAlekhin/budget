package record

import (
	db "budget/database"
)

type service struct {
}

func (s service) GetAll(id string) []db.Record {
	var records []db.Record
	if res := db.Instance.Preload("Category").Joins("INNER JOIN categories ON categories.id = records.category_id").Where("categories.user_id = ? and records.deleted_at IS NULL", id).Order("timestamp desc").Find(&records); res.RowsAffected == 0 {
		records = make([]db.Record, 0)
	}

	return records
}

func (s service) CreateMany(userId string) (error, []db.Record) {
	var records []db.Record

	return nil, records
}

var Service = service{}

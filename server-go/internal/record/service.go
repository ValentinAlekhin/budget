package record

import (
	db "budget/database"
	"budget/internal/category"
	http_error "budget/internal/http-error"
	"budget/internal/ws"
	"encoding/json"
	"fmt"
	"github.com/samber/lo"
	"time"
)

type service struct {
}

func (s service) GetAll(id string) []db.Record {
	var records []db.Record
	if res := db.Instance.
		Preload("Category").
		Joins("INNER JOIN categories ON categories.id = records.category_id").
		Where("categories.user_id = ? and records.deleted_at IS NULL", id).
		Order("timestamp desc").Find(&records); res.RowsAffected == 0 {
		records = make([]db.Record, 0)
	}

	return records
}

func (s service) FindOne(userId string, id string) (error, db.Record) {
	var record db.Record

	err := http_error.NewNotFoundError("Record not found", "")

	fmt.Println(id)

	if res := db.Instance.
		Preload("Category").
		Joins("INNER JOIN categories ON categories.id = records.category_id").
		Where("categories.user_id = ?", userId).
		Where("records.id = ?", id).
		First(&record); res.Error != nil || res.RowsAffected == 0 {
		return err, record
	} else {
		return nil, record
	}
}

func (s service) CreateOne(userId string, dto CreateOneRecordRequestDto) (error, db.Record) {
	err, categoryEntity := category.Service.FindOne(userId, dto.CategoryId)
	if err != nil {
		return err, db.Record{}
	}

	newRecord := db.Record{
		Amount:    dto.Amount,
		Comment:   dto.Comment,
		Category:  categoryEntity,
		Timestamp: dto.Timestamp,
	}

	db.Instance.Create(&newRecord)

	s.sendCudAction(userId, "create", newRecord)

	return nil, newRecord
}

func (s service) CreateMany(userId string, dto CreateManyRecordsRequestDto) (error, []db.Record) {
	categoryIds := lo.Map(dto.Items, func(item CreateOneRecordRequestDto, _ int) string {
		return item.CategoryId
	})
	categoryIds = lo.Uniq(categoryIds)

	categories := category.Service.GetCategoriesByIds(userId, categoryIds)
	if len(categories) != len(categoryIds) {
		return http_error.NewBadRequestError("Invalid category ids", ""), []db.Record{}
	}

	categoriesMap := make(map[string]db.Category)
	for _, categoryEntity := range categories {
		categoriesMap[categoryEntity.ID] = categoryEntity
	}

	var records []db.Record

	for _, item := range dto.Items {
		record := db.Record{
			Amount:    item.Amount,
			Comment:   item.Comment,
			Category:  categoriesMap[item.CategoryId],
			Timestamp: item.Timestamp,
		}
		records = append(records, record)
	}

	db.Instance.Create(&records)

	s.sendCudActionMany(userId, "create", records)

	return nil, records
}

func (s service) UpdateOne(userId string, dto UpdateOneRecordRequestDto) (error, db.Record) {
	if err, _ := Service.FindOne(userId, dto.ID); err != nil {
		return err, db.Record{}
	}

	err, categoryEntity := category.Service.FindOne(userId, dto.CategoryId)
	if err != nil {
		return err, db.Record{}
	}

	record := db.Record{
		Model:     db.Model{ID: dto.ID},
		Amount:    dto.Amount,
		Comment:   dto.Comment,
		Category:  categoryEntity,
		Timestamp: dto.Timestamp,
	}

	if res := db.Instance.Model(&record).Updates(&record); res.Error != nil || res.RowsAffected == 0 {
		return http_error.NewBadRequestError("Server error", record.ID), db.Record{}
	}

	s.sendCudAction(userId, "update", record)

	return nil, record
}

func (s service) DeleteOne(userId string, id string) (error, db.Record) {
	if err, record := s.FindOne(userId, id); err != nil {
		return err, record
	} else {
		db.Instance.Delete(&record)

		s.sendCudAction(userId, "delete", record)

		return nil, record
	}
}

func (s service) Adjustment(userId string, dto AdjustmentRequestDto) (error, db.Record) {
	err, adjustmentCategory := category.Service.GetAdjustmentCategory(userId)
	if err != nil {
		return err, db.Record{}
	}

	newRecord := db.Record{
		Amount:    dto.Diff,
		Category:  adjustmentCategory,
		Timestamp: time.Now(),
	}

	db.Instance.Create(&newRecord)

	s.sendCudAction(userId, "create", newRecord)

	return nil, newRecord
}

func (s service) sendCudAction(userId string, action string, item db.Record) {
	list := make([]db.Record, 0)
	list = append(list, item)
	s.sendCudActionMany(userId, action, list)
}

func (s service) sendCudActionMany(userId string, action string, list []db.Record) {
	jsonMsg, _ := json.Marshal(SocketRecordCudActionDto{
		BaseSocketActionDto: ws.BaseSocketActionDto{Type: "cud", Timestamp: time.Now()},
		Payload:             SocketSocketRecordCudActionPayloadDto{action, list},
	})
	ws.Manager.SendToUser(userId, jsonMsg)
}

var Service = service{}

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

func (s service) GetAll(id string) []RecordResponseDto {
	var records []db.Record
	if res := db.Instance.
		Preload("Category").
		Joins("INNER JOIN categories ON categories.id = records.category_id").
		Where("categories.user_id = ? and records.deleted_at IS NULL", id).
		Order("timestamp desc").Find(&records); res.RowsAffected == 0 {
		records = make([]db.Record, 0)
	}

	return s.makeManyResponse(records)
}

func (s service) FindOne(userId string, id string) (error, RecordResponseDto) {
	var record db.Record

	err := http_error.NewNotFoundError("Record not found", "")

	fmt.Println(id)

	if res := db.Instance.
		Preload("Category").
		Joins("INNER JOIN categories ON categories.id = records.category_id").
		Where("categories.user_id = ?", userId).
		Where("records.id = ?", id).
		First(&record); res.Error != nil || res.RowsAffected == 0 {
		return err, RecordResponseDto{}
	} else {
		return nil, s.makeResponse(record)
	}
}

func (s service) CreateOne(userId string, dto CreateOneRecordRequestDto) (error, RecordResponseDto) {
	err, categoryEntity := category.Service.FindOne(userId, dto.CategoryID)
	if err != nil {
		return err, RecordResponseDto{}
	}

	newRecord := db.Record{
		Amount:    dto.Amount,
		Comment:   dto.Comment,
		Category:  categoryEntity,
		Timestamp: dto.Timestamp,
	}

	db.Instance.Create(&newRecord)

	response := s.makeResponse(newRecord)
	s.sendCudAction(userId, "create", response)

	return nil, response
}

func (s service) CreateMany(userId string, dto CreateManyRecordsRequestDto) (error, []RecordResponseDto) {
	categoryIds := lo.Map(dto.Data, func(item CreateOneRecordRequestDto, _ int) string {
		return item.CategoryID
	})
	categoryIds = lo.Uniq(categoryIds)

	categories := category.Service.GetCategoriesByUserIdAndIds(userId, categoryIds)
	if len(categories) != len(categoryIds) {
		return http_error.NewBadRequestError("Invalid category ids", ""), []RecordResponseDto{}
	}

	categoriesMap := make(map[string]db.Category)
	for _, categoryEntity := range categories {
		categoriesMap[categoryEntity.ID] = categoryEntity
	}

	var records []db.Record

	for _, item := range dto.Data {
		record := db.Record{
			Amount:     item.Amount,
			Comment:    item.Comment,
			CategoryID: item.CategoryID,
			Timestamp:  item.Timestamp,
		}
		records = append(records, record)
	}

	db.Instance.Create(&records)

	response := s.makeManyResponse(records)
	s.sendCudActionMany(userId, "create", response)

	return nil, response
}

func (s service) UpdateOne(userId string, dto UpdateOneRecordRequestDto) (error, RecordResponseDto) {
	if err, _ := Service.FindOne(userId, dto.ID); err != nil {
		return err, RecordResponseDto{}
	}

	err, categoryEntity := category.Service.FindOne(userId, dto.CategoryID)
	if err != nil {
		return err, RecordResponseDto{}
	}

	record := db.Record{
		Model:      db.Model{ID: dto.ID},
		Amount:     dto.Amount,
		Comment:    dto.Comment,
		CategoryID: categoryEntity.ID,
		Timestamp:  dto.Timestamp,
	}

	if res := db.Instance.Model(&record).Updates(&record); res.Error != nil || res.RowsAffected == 0 {
		return http_error.NewBadRequestError("Server error", record.ID), RecordResponseDto{}
	}

	response := s.makeResponse(record)
	s.sendCudAction(userId, "update", response)

	return nil, response
}

func (s service) DeleteOne(userId string, id string) (error, RecordResponseDto) {
	if err, recordDto := s.FindOne(userId, id); err != nil {
		return err, recordDto
	} else {
		record := db.Record{Model: db.Model{ID: id}}
		if res := db.Instance.Delete(&record); res.Error != nil {
			return http_error.NewInternalRequestError(id), RecordResponseDto{}
		}

		s.sendCudAction(userId, "delete", recordDto)
		return nil, recordDto
	}
}

func (s service) Adjustment(userId string, dto AdjustmentRequestDto) (error, RecordResponseDto) {
	err, adjustmentCategory := category.Service.GetAdjustmentCategory(userId)
	if err != nil {
		return err, RecordResponseDto{}
	}

	newRecord := db.Record{
		Amount:    dto.Diff,
		Category:  adjustmentCategory,
		Timestamp: time.Now(),
	}

	db.Instance.Create(&newRecord)

	response := s.makeResponse(newRecord)
	s.sendCudAction(userId, "create", response)

	return nil, response
}

func (s service) sendCudAction(userId string, action string, item RecordResponseDto) {
	list := make([]RecordResponseDto, 0)
	list = append(list, item)
	s.sendCudActionMany(userId, action, list)
}

func (s service) sendCudActionMany(userId string, action string, list []RecordResponseDto) {
	jsonMsg, _ := json.Marshal(SocketRecordCudActionDto{
		BaseSocketActionDto: ws.BaseSocketActionDto{Type: "cud", Timestamp: time.Now()},
		Payload:             SocketSocketRecordCudActionPayloadDto{Action: action, List: list, Entity: "record"},
	})
	ws.Manager.SendToUser(userId, jsonMsg)
}

func (s service) makeResponse(record db.Record) RecordResponseDto {
	categoryEntity := category.Service.FindById(record.CategoryID)

	return RecordResponseDto{
		ID:         record.ID,
		CreatedAt:  record.CreatedAt,
		UpdatedAt:  record.UpdatedAt,
		DeletedAt:  record.DeletedAt,
		Amount:     record.Amount,
		Comment:    record.Comment,
		CategoryID: record.CategoryID,
		Timestamp:  record.Timestamp,
		Type:       categoryEntity.Type,
	}
}

func (s service) makeManyResponse(list []db.Record) []RecordResponseDto {
	categoryIds := lo.Map(list, func(item db.Record, _ int) string {
		return item.CategoryID
	})
	categoryIds = lo.Uniq(categoryIds)
	categories := category.Service.GetCategoriesByIds(categoryIds)
	categoriesMap := make(map[string]db.Category)
	for _, categoryEntity := range categories {
		categoriesMap[categoryEntity.ID] = categoryEntity
	}

	response := make([]RecordResponseDto, 0)
	for _, item := range list {
		targetCategory := categoriesMap[item.CategoryID]

		recordResponse := RecordResponseDto{
			ID:         item.ID,
			CreatedAt:  item.CreatedAt,
			UpdatedAt:  item.UpdatedAt,
			DeletedAt:  item.DeletedAt,
			Amount:     item.Amount,
			Comment:    item.Comment,
			CategoryID: item.CategoryID,
			Timestamp:  item.Timestamp,
			Type:       targetCategory.Type,
		}
		response = append(response, recordResponse)
	}

	return response
}

var Service = service{}

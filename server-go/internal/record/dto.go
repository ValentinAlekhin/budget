package record

type CreateRecordRequestDto struct {
	Amount     int    `json:"amount" binding:"required"`
	Comment    string `json:"comment" binding:"omitempty"`
	CategoryId string `json:"categoryId" binding:"required"`
}

type CreateManyRecordsRequestDto struct {
	Items []CreateRecordRequestDto `json:"items" binding:"dive"`
}

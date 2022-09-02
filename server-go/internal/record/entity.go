package record

import db "budget/database"

type Record struct {
	db.Model
	Amount     string `json:"amount"`
	Type       string `json:"type"`
	Comment    string `json:"comment"`
	UserID     uint   `json:"userID"`
	CategoryID uint   `json:"categoryID"`
}

func init() {
	if err := db.Instance.AutoMigrate(&Record{}); err != nil {
		panic(err)
	}
}

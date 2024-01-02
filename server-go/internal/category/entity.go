package category

import (
	"time"
)

type Category struct {
	ID        string            `gorm:"primary_key;type:varchar(255);unique" json:"id"`
	CreatedAt time.Time         `json:"createdAt"`
	UpdatedAt time.Time         `json:"updatedAt"`
	DeletedAt *time.Time        `sql:"index" json:"deletedAt,omitempty"`
	Name      string            `gorm:"type:varchar(20)" json:"name"`
	Type      string  					`gorm:"type:enum" json:"type"`
	Order     int               `gorm:"type:int" json:"order"`
	Plan      *int              `gorm:"type:int" json:"plan,omitempty"`
	PlanPeriod string 					`gorm:"type:enum;default:'Month'" json:"planPeriod"`
	Color     *string           `gorm:"type:varchar(7)" json:"color,omitempty"`
	Icon      *string           `gorm:"type:string" json:"icon,omitempty"`
	Comment   *string           `gorm:"type:string" json:"comment,omitempty"`
	UserID    string            `gorm:"type:string" json:"userId"`
}

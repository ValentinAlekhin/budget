package database

import (
	"github.com/jackc/pgtype"
	"time"
)

type CategoryType string

const (
	CategoryTypeInc        CategoryType = "inc"
	CategoryTypeCost       CategoryType = "cost"
	CategoryTypeAdjustment CategoryType = "adjustment"
)

type PlanPeriod string

const (
	PlanPeriodDay     PlanPeriod = "day"
	PlanPeriodWeek    PlanPeriod = "week"
	PlanPeriodMonth   PlanPeriod = "month"
	PlanPeriodQuarter PlanPeriod = "quarter"
	PlanPeriodYear    PlanPeriod = "year"
)

type User struct {
	Model
	Username      string         `gorm:"uniqueIndex" json:"username"`
	Email         string         `gorm:"uniqueIndex" json:"email"`
	Password      string         `json:"password,omitempty"`
	Categories    []Category     `json:"categories"`
	RefreshTokens []RefreshToken `gorm:"foreignKey:user_id" json:"refreshTokens"`
}

func (User) TableName() string {
	return "users"
}

type RefreshToken struct {
	Model
	RefreshToken string    `json:"refreshToken"`
	ExpiresAt    time.Time `json:"expiresAt"`
	UserId       string    `json:"userId"`
}

func (RefreshToken) TableName() string {
	return "refresh_tokens"
}

type Category struct {
	Model
	Name       string       `json:"name"`
	Type       CategoryType `json:"type"`
	Order      int          ` json:"order"`
	Plan       int          `json:"plan,omitempty"`
	PlanPeriod PlanPeriod   `json:"planPeriod"`
	Color      string       `json:"color,omitempty"`
	Icon       string       `json:"icon,omitempty"`
	Comment    string       `json:"comment,omitempty"`
	UserID     string       `json:"userId"`
	Records    []Record     `gorm:"foreignkey:category_id" json:"records"`
}

func (Category) TableName() string {
	return "categories"
}

type Record struct {
	Model
	Amount     int       `json:"amount"`
	Comment    string    `json:"comment,omitempty"`
	Category   Category  `gorm:"foreignkey:category_id" json:"category"`
	CategoryID string    `json:"categoryId"`
	Timestamp  time.Time `json:"timestamp"`
}

func (Record) TableName() string {
	return "records"
}

type Desktop struct {
	Model
	Name    string   `json:"name"`
	Icon    string   `json:"icon"`
	Order   int      `json:"order"`
	Width   int      `json:"width"`
	Height  int      `json:"height"`
	Widgets []Widget `gorm:"foreignkey:desktop_id" json:"widgets"`
}

func (Desktop) TableName() string {
	return "desktops"
}

type WidgetType struct {
	Model
	Type      string   `json:"type"`
	MaxWidth  int      `json:"maxWidth"`
	MinWidth  int      `json:"minWidth"`
	MaxHeight int      `json:"maxHeight"`
	MinHeight int      `json:"minHeight"`
	Widgets   []Widget `gorm:"foreignkey:type_id"`
}

func (WidgetType) TableName() string {
	return "widget_types"
}

type Widget struct {
	Model
	TypeId    string       `json:"typeId"`
	Type      WidgetType   `json:"type"`
	Settings  pgtype.JSONB `gorm:"type:jsonb;default:'{}';not null" json:"settings"`
	DesktopId string       `json:"desktopId"`
}

func (Widget) TableName() string {
	return "widgets"
}

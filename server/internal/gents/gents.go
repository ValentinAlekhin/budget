package gents

import (
	"budget/internal/auth"
	"budget/internal/category"
	"budget/internal/db"
	"budget/internal/record"
	"budget/internal/user"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
	"time"
)

var AllCategoriesTypeEnum = []struct {
	Value  db.CategoriesTypeEnum
	TSName string
}{
	{db.CategoriesTypeEnumAdjustment, "ADJUSTMENT"},
	{db.CategoriesTypeEnumCost, "COST"},
	{db.CategoriesTypeEnumInc, "INC"},
}

var AllCategoriesPlanPeriodEnum = []struct {
	Value  db.CategoriesPlanPeriodEnum
	TSName string
}{
	{db.CategoriesPlanPeriodEnumDay, "DAY"},
	{db.CategoriesPlanPeriodEnumWeek, "WEEK"},
	{db.CategoriesPlanPeriodEnumMonth, "MONTH"},
	{db.CategoriesPlanPeriodEnumQuarter, "QUARTER"},
	{db.CategoriesPlanPeriodEnumYear, "YEAR"},
}

func Run(filename string) error {
	converter := typescriptify.New().
		Add(record.RecordResponseDto{}).
		Add(record.CreateOneRecordRequestDto{}).
		Add(record.UpdateOneRecordRequestDto{}).
		Add(record.CreateManyRecordsRequestDto{}).
		Add(record.AdjustmentRequestDto{}).
		Add(category.CreateCategoryRequestDto{}).
		Add(category.UpdateCategoryRequestDto{}).
		Add(category.UpdateManyCategoryRequestDto{}).
		Add(category.UpdateCategoryOrderRequestDto{}).
		Add(category.UpdateManyCategoryOrderRequestDto{}).
		Add(category.CategoryResponseDto{}).
		Add(auth.LoginRequestDto{}).
		Add(auth.PureUserDto{}).
		Add(auth.LoginResponseDto{}).
		Add(auth.RefreshTokenRequestDto{}).
		Add(auth.RefreshTokenResponseDto{}).
		Add(user.ChangePasswordRequestDto{}).
		AddEnum(AllCategoriesTypeEnum).
		AddEnum(AllCategoriesPlanPeriodEnum).
		ManageType(time.Time{}, typescriptify.TypeOptions{TSType: "string"}).
		ManageType(pgtype.Timestamp{}, typescriptify.TypeOptions{TSType: "string"}).
		ManageType(pgtype.Numeric{}, typescriptify.TypeOptions{TSType: "number"})

	converter.CreateInterface = true
	err := converter.ConvertToFile(filename)
	if err != nil {
		return err
	}

	return nil
}

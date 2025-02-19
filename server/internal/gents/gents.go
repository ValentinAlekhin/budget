package gents

import (
	"budget/internal/auth"
	"budget/internal/category"
	"budget/internal/db/sqlc/budget"
	"budget/internal/record"
	"budget/internal/user"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
	"time"
)

var AllCategoriesTypeEnum = []struct {
	Value  budget.CategoriesTypeEnum
	TSName string
}{
	{budget.CategoriesTypeEnumAdjustment, "ADJUSTMENT"},
	{budget.CategoriesTypeEnumCost, "COST"},
	{budget.CategoriesTypeEnumInc, "INC"},
}

var AllCategoriesPlanPeriodEnum = []struct {
	Value  budget.CategoriesPlanPeriodEnum
	TSName string
}{
	{budget.CategoriesPlanPeriodEnumDay, "DAY"},
	{budget.CategoriesPlanPeriodEnumWeek, "WEEK"},
	{budget.CategoriesPlanPeriodEnumMonth, "MONTH"},
	{budget.CategoriesPlanPeriodEnumQuarter, "QUARTER"},
	{budget.CategoriesPlanPeriodEnumYear, "YEAR"},
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

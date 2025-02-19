package convert

import (
	"github.com/jackc/pgx/v5/pgtype"
	"math"
	"math/big"
	"strconv"
)

func StringToUint(string string) (uint, error) {
	u64, err := strconv.ParseUint(string, 10, 32)
	if err != nil {
		return 0, err
	}

	return uint(u64), nil
}

func Float64ToNumeric(f float64, scale int32) pgtype.Numeric {
	scaled := f * math.Pow10(int(scale))
	intVal := new(big.Int).SetInt64(int64(scaled))
	return pgtype.Numeric{
		Int:   intVal,
		Exp:   -scale,
		Valid: true,
	}
}

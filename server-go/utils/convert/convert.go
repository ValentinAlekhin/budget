package convert

import (
	"strconv"
)

func StringToUint(string string) (uint, error) {
	u64, err := strconv.ParseUint(string, 10, 32)
	if err != nil {
		return 0, err
	}

	return uint(u64), nil
}

package config

import (
	"fmt"
	"github.com/spf13/viper"
)

type Telegram struct {
	Token   string `mapstructure:"TELEGRAM_BOT_TOKEN"`
	AdminID int64  `mapstructure:"TELEGRAM_BOT_ADMIN"`
	Enable  bool   `mapstructure:"TELEGRAM_BOT_ENABLE"`
}

func NewTelegram() (*Telegram, error) {
	viper.SetDefault("TELEGRAM_BOT_TOKEN", "")
	viper.SetDefault("TELEGRAM_BOT_ADMIN", "")
	viper.SetDefault("TELEGRAM_BOT_ENABLE", "false")

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("error reading config file: %s", err)
	}

	var telegram Telegram
	if err := viper.Unmarshal(&telegram); err != nil {
		return nil, fmt.Errorf("unable to decode Telegram config: %v", err)
	}

	return &telegram, nil
}

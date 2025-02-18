package config

import (
	"fmt"
	"github.com/spf13/viper"
)

type JWT struct {
	AccessTokenSecret      string `mapstructure:"ACCESS_TOKEN_SECRET"`
	AccessTokenExpiration  int    `mapstructure:"ACCESS_TOKEN_EXPIRATION"`
	RefreshTokenSecret     string `mapstructure:"REFRESH_TOKEN_SECRET"`
	RefreshTokenExpiration int    `mapstructure:"REFRESH_TOKEN_EXPIRATION"`
}

func NewJWT() (*JWT, error) {
	viper.SetDefault("ACCESS_TOKEN_SECRET", "secret")
	viper.SetDefault("ACCESS_TOKEN_EXPIRATION", "5m")
	viper.SetDefault("REFRESH_TOKEN_SECRET", "secret")
	viper.SetDefault("REFRESH_TOKEN_EXPIRATION", "30d")

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("error reading config file: %s", err)
	}

	var jwt JWT
	if err := viper.Unmarshal(&jwt); err != nil {
		return nil, fmt.Errorf("unable to decode JWT config: %v", err)
	}

	return &jwt, nil
}

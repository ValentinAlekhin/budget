package config

import (
	"fmt"
	"github.com/spf13/viper"
)

type Server struct {
	Port string `mapstructure:"PORT"`
}

func NewServer() (*Server, error) {
	viper.SetDefault("PORT", "3001")

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("error reading config file: %s", err)
	}

	var server Server
	if err := viper.Unmarshal(&server); err != nil {
		return nil, fmt.Errorf("unable to decode Server config: %v", err)
	}

	return &server, nil
}

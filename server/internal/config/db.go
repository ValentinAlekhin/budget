package config

import (
	"fmt"
	"github.com/spf13/viper"
)

type DB struct {
	Host     string `mapstructure:"DB_HOST"`
	Port     string `mapstructure:"DB_PORT"`
	User     string `mapstructure:"DB_USERNAME"`
	Password string `mapstructure:"DB_PASSWORD"`
	Name     string `mapstructure:"DB_NAME"`
}

func NewDB() (*DB, error) {
	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_USERNAME", "budget")
	viper.SetDefault("DB_PASSWORD", "budget")
	viper.SetDefault("DB_NAME", "budget")
	viper.SetDefault("DB_PORT", "5433")

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	var db DB

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("Error reading config file, %s\n", err)
	}

	if err := viper.Unmarshal(&db); err != nil {
		return nil, fmt.Errorf("Unable to decode into struct, %v\n", err)
	}

	return &db, nil
}

func (config DB) GetConnectionString() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Moscow", config.Host, config.User, config.Password, config.Name, config.Port)
}

func (config DB) GetUrl() string {
	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", config.User, config.Password, config.Host, config.Port, config.Name)
}

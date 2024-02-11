package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type server struct {
	Port string `mapstructure:"PORT"`
}

type db struct {
	Host     string `mapstructure:"DB_HOST"`
	Port     string `mapstructure:"DB_PORT"`
	User     string `mapstructure:"DB_USERNAME"`
	Password string `mapstructure:"DB_PASSWORD"`
	Name     string `mapstructure:"DB_NAME"`
}

func (config db) GetDns() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Moscow", config.Host, config.User, config.Password, config.Name, config.Port)
}

func (config db) GetUrl() string {
	return fmt.Sprintf("postgresql://%s:%s@$%s:%s/%s", config.User, config.Password, config.Host, config.Port, config.Name)
}

type jwt struct {
	AccessTokenSecret      string `mapstructure:"ACCESS_TOKEN_SECRET"`
	AccessTokenExpiration  string `mapstructure:"ACCESS_TOKEN_EXPIRATION"`
	RefreshTokenSecret     string `mapstructure:"REFRESH_TOKEN_SECRET"`
	RefreshTokenExpiration string `mapstructure:"REFRESH_TOKEN_EXPIRATION"`
}

var Server server
var DB db
var JWT jwt

func init() {
	viper.SetDefault("PORT", "3001")

	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_USERNAME", "budget")
	viper.SetDefault("DB_PASSWORD", "budget")
	viper.SetDefault("DB_NAME", "budget")
	viper.SetDefault("DB_PORT", "5433")

	viper.SetDefault("ACCESS_TOKEN_SECRET", "secret")
	viper.SetDefault("ACCESS_TOKEN_EXPIRATION", "5m")
	viper.SetDefault("REFRESH_TOKEN_SECRET", "secret")
	viper.SetDefault("REFRESH_TOKEN_EXPIRATION", "30d")

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("Error reading config file, %s\n", err)
	}

	if err := viper.Unmarshal(&Server); err != nil {
		fmt.Printf("Unable to decode into struct, %v\n", err)
	}

	if err := viper.Unmarshal(&DB); err != nil {
		fmt.Printf("Unable to decode into struct, %v\n", err)
	}

	if err := viper.Unmarshal(&JWT); err != nil {
		fmt.Printf("Unable to decode into struct, %v\n", err)
	}
}

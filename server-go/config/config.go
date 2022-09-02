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
	User     string `mapstructure:"DB_USER"`
	Password string `mapstructure:"DB_PASSWORD"`
	Name     string `mapstructure:"DB_NAME"`
}

type jwt struct {
	Secret string `mapstructure:"JWT_SECRET"`
}

var Server server
var DB db
var JWT jwt

func init() {
	viper.SetDefault("PORT", "3001")
	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_USER", "budget")
	viper.SetDefault("DB_PASSWORD", "budget")
	viper.SetDefault("DB_NAME", "budget")
	viper.SetDefault("DB_PORT", "5433")
	viper.SetDefault("JWT_SECRET", "secret")

	viper.SetConfigFile(".env")

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("Error reading config file, %s", err)
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

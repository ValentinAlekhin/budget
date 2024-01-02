package router

import (
	"budget/config"
	"budget/internal/auth"
	"budget/internal/record"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Init() {
	router := gin.Default()
	router.Use(cors.Default())

	// userGroup := router.Group("/user")
	// userGroup.POST("", user.Controller.CreateOne)

	// categoryGroup := router.Group("/category")
	// categoryGroup.Use(auth.Middlewares.AuthRequired)
	// categoryGroup.GET("", category.Controller.GetAll)
	// categoryGroup.POST("", category.Controller.CreateOne)
	// categoryGroup.PUT("/:id", category.Controller.UpdateOne)
	// categoryGroup.DELETE("/:id", category.Controller.DeleteOne)

	recordGroup := router.Group("/records")
	recordGroup.Use(auth.Middlewares.AuthRequired)
	recordGroup.GET("", record.Controller.GetAll)
	// recordGroup.POST("", record.Controller.CreateOne)
	// recordGroup.PUT("/:id", record.Controller.UpdateOne)
	// recordGroup.DELETE("/:id", record.Controller.DeleteOne)

	// authGroup := router.Group("/auth")
	// authGroup.POST("/login", auth.Controller.Login)
	// authGroup.GET("/me", auth.Middlewares.AuthRequired, auth.Controller.Me)
	// authGroup.GET("/logout", auth.Middlewares.AuthRequired, auth.Controller.Logout)

	if err := router.Run(fmt.Sprintf(":%s", config.Server.Port)); err != nil {
		panic(err)
	}
}

package router

import (
	"budget/config"
	"budget/internal/auth"
	"budget/internal/category"
	httperror "budget/internal/http-error"
	"budget/internal/record"
	"budget/internal/user"
	"budget/internal/ws"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Init() {
	router := gin.Default()
	router.Use(cors.Default())
	router.Use(httperror.ErrorHandler())

	wsGroup := router.Group("/ws")
	wsGroup.Use(auth.Middlewares.AuthRequiredCookie)
	wsGroup.GET("", ws.WsHandler)

	userGroup := router.Group("/user")
	userGroup.POST("", user.Controller.CreateOne)

	userValidationGroup := router.Group("/user-field-validation")
	userValidationGroup.POST("/email", user.FieldValidationController.ValidateEmail)
	userValidationGroup.POST("/username", user.FieldValidationController.ValidateUsername)

	categoryGroup := router.Group("/category")
	categoryGroup.Use(auth.Middlewares.AuthRequired)
	categoryGroup.GET("", category.Controller.GetAll)
	categoryGroup.POST("", category.Controller.CreateOne)
	categoryGroup.PUT("/many", category.Controller.UpdateMany)
	// categoryGroup.PUT("/:id", category.Controller.UpdateOne)
	categoryGroup.DELETE("/:id", category.Controller.DeleteOne)

	recordGroup := router.Group("/records")
	recordGroup.Use(auth.Middlewares.AuthRequired)
	recordGroup.GET("", record.Controller.GetAll)
	recordGroup.POST("/adjustment", record.Controller.Adjustment)
	recordGroup.GET("/:id", record.Controller.GetOne)
	recordGroup.POST("", record.Controller.CreateOne)
	recordGroup.POST("/many", record.Controller.CreateMany)
	recordGroup.PUT("/:id", record.Controller.UpdateOne)
	recordGroup.DELETE("/:id", record.Controller.DeleteOne)

	authGroup := router.Group("/auth")
	authGroup.POST("/login", auth.Controller.Login)
	authGroup.GET("/me", auth.Middlewares.AuthRequired, auth.Controller.Me)
	authGroup.POST("/refresh-tokens", auth.Controller.RefreshTokens)
	// authGroup.GET("/logout", auth.Middlewares.AuthRequired, auth.Controller.Logout)

	if err := router.Run(fmt.Sprintf(":%s", config.Server.Port)); err != nil {
		panic(err)
	}
}

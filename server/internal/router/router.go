package router

import (
	"budget/internal/auth"
	"budget/internal/category"
	"budget/internal/config"
	httperror "budget/internal/http-error"
	"budget/internal/record"
	"budget/internal/user"
	"budget/internal/ws"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(db *pgxpool.Pool, jwtConfig *config.JWT, serverConfig *config.Server) error {
	userController := user.NewController(db)
	userFieldValidationController := user.NewFieldValidationController(db)
	authController := auth.NewController(db, jwtConfig)
	authMiddlewares := auth.NewMiddlewares(db, jwtConfig)
	categoryController := category.NewController(db)
	recordController := record.NewController(db)

	router := gin.Default()
	router.Use(cors.Default())
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(httperror.ErrorHandler())

	wsGroup := router.Group("/ws")
	wsGroup.Use(authMiddlewares.AuthRequiredCookie)
	wsGroup.GET("", ws.Handler)

	userGroup := router.Group("/user")
	userGroup.POST("", userController.CreateOne)

	userValidationGroup := router.Group("/user-field-validation")
	userValidationGroup.POST("/email", userFieldValidationController.ValidateEmail)
	userValidationGroup.POST("/username", userFieldValidationController.ValidateUsername)

	categoryGroup := router.Group("/category")
	categoryGroup.Use(authMiddlewares.AuthRequired)
	categoryGroup.GET("", categoryController.GetAll)
	categoryGroup.POST("", categoryController.CreateOne)
	categoryGroup.PUT("/many", categoryController.UpdateMany)
	categoryGroup.PUT("/many/order", categoryController.UpdateManyOrder)
	categoryGroup.PUT("/:id", categoryController.UpdateOne)
	categoryGroup.DELETE("/:id", categoryController.DeleteOne)

	recordGroup := router.Group("/records")
	recordGroup.Use(authMiddlewares.AuthRequired)
	recordGroup.GET("", recordController.GetAll)
	recordGroup.POST("/adjustment", recordController.Adjustment)
	recordGroup.GET("/:id", recordController.GetOne)
	recordGroup.POST("", recordController.CreateOne)
	recordGroup.POST("/many", recordController.CreateMany)
	recordGroup.PUT("/:id", recordController.UpdateOne)
	recordGroup.DELETE("/:id", recordController.DeleteOne)

	authGroup := router.Group("/auth")
	authGroup.POST("/login", authController.Login)
	authGroup.GET("/me", authMiddlewares.AuthRequired, authController.Me)
	authGroup.POST("/refresh-tokens", authController.RefreshTokens)
	// authGroup.GET("/logout", auth.Middlewares.AuthRequired, auth.Controller.Logout)

	if err := router.Run(fmt.Sprintf(":%s", serverConfig.Port)); err != nil {
		return err
	}
	return nil
}

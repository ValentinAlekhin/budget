package router

import (
	"budget/internal/auth"
	"budget/internal/category"
	"budget/internal/config"
	httperror "budget/internal/http-error"
	"budget/internal/record"
	refresh_token "budget/internal/refresh-token"
	"budget/internal/user"
	"budget/internal/ws"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(db *pgxpool.Pool, jwtConfig *config.JWT, serverConfig *config.Server) error {
	userRepo := user.NewUserRepo(db)
	tokenRepo := refresh_token.NewRepo(db)
	categoryRepo := category.NewCategoryRepo(db)
	recordRepo := record.NewRecordsRepo(db)

	userService := user.NewService(userRepo)
	authService := auth.NewService(jwtConfig, userService, tokenRepo)
	categoryService := category.NewService(categoryRepo)
	recordService := record.NewService(recordRepo, categoryRepo)

	userController := user.NewController(userService)
	userFieldValidationController := user.NewFieldValidationController(userService)
	authController := auth.NewController(authService)
	authMiddlewares := auth.NewMiddlewares(userService, authService, jwtConfig)
	categoryController := category.NewController(categoryService)
	recordController := record.NewController(recordService)

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
	authGroup.GET("/logout", authMiddlewares.AuthRequired, authController.Logout)

	if err := router.Run(fmt.Sprintf(":%s", serverConfig.Port)); err != nil {
		return err
	}
	return nil
}

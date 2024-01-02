package category

type CreateCategoryRequest struct {
	Name    string `json:"name" binding:"required"`
	Type    string `json:"type" binding:"required"`
	Comment string `json:"comment" binding:"omitempty"`
}

type UpdateCategoryRequest struct {
	Name    string `json:"name" binding:"required"`
	Comment string `json:"comment" binding:"omitempty"`
}

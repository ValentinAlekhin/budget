package http_error

import (
	"net/http"
)

type HttpError struct {
	Description string `json:"description,omitempty"`
	Metadata    string `json:"metadata,omitempty"`
	StatusCode  int    `json:"statusCode"`
}

func (e HttpError) Error() string {
	return ""
}

func NewHttpError(description, metadata string, statusCode int) HttpError {
	return HttpError{
		Description: description,
		Metadata:    metadata,
		StatusCode:  statusCode,
	}
}

func NewNotFoundError(description, metadata string) HttpError {
	return HttpError{
		Description: description,
		Metadata:    metadata,
		StatusCode:  http.StatusNotFound,
	}
}

func NewBadRequestError(description, metadata string) HttpError {
	return HttpError{
		Description: description,
		Metadata:    metadata,
		StatusCode:  http.StatusBadRequest,
	}
}

func NewInternalRequestError(metadata string) HttpError {
	return HttpError{
		Description: "Internal error",
		Metadata:    metadata,
		StatusCode:  http.StatusInternalServerError,
	}
}

func NewUnauthorizedError(metadata string) HttpError {
	return HttpError{
		Description: "Unauthorized",
		Metadata:    metadata,
		StatusCode:  http.StatusUnauthorized,
	}
}

package main

import (
	db "budget/database"
	"fmt"
	"io"
	"os"

	_ "ariga.io/atlas-go-sdk/recordriver"
	"ariga.io/atlas-provider-gorm/gormschema"
)

// Define the models to generate migrations for.
var models = []any{
	&db.User{},
	&db.RefreshToken{},
	&db.Category{},
	&db.Record{},
	&db.Desktop{},
	&db.Widget{},
	&db.WidgetType{},
}

func main() {
	stmts, err := gormschema.New("postgres").Load(models...)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load gorm schema: %v\n", err)
		os.Exit(1)
	}
	io.WriteString(os.Stdout, stmts)
}

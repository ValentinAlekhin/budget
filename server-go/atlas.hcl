data "external_schema" "gorm" {
  program = ["go", "run", "./scripts/atlas-gorm-loader.go"]
}

env "local" {
  src = data.external_schema.gorm.url
  dev = "postgres://cnp:cnp@:8432/go?search_path=public&sslmode=disable"

  migration {
    dir = "file://migrations"
    format = golang-migrate
  }

  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}
-- create enum type "categories_type_enum"
CREATE TYPE "categories_type_enum" AS ENUM ('inc', 'cost', 'adjustment');
-- create enum type "categories_plan_period_enum"
CREATE TYPE "categories_plan_period_enum" AS ENUM ('day', 'week', 'month', 'quarter', 'year');
-- create "migrations" table
CREATE TABLE "migrations" (
  "id" serial NOT NULL,
  "timestamp" bigint NOT NULL,
  "name" character varying NOT NULL,
  PRIMARY KEY ("id")
);
-- create "users" table
CREATE TABLE "users" (
  "id" character varying NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "username" character varying NOT NULL,
  "email" character varying NOT NULL,
  "password" character varying NOT NULL,
  "deleted_at" timestamp NULL,
  PRIMARY KEY ("id")
);
-- create index "UQ_97672ac88f789774dd47f7c8be3" to table: "users"
CREATE UNIQUE INDEX "UQ_97672ac88f789774dd47f7c8be3" ON "users" ("email");
-- create index "UQ_fe0bb3f6520ee0469504521e710" to table: "users"
CREATE UNIQUE INDEX "UQ_fe0bb3f6520ee0469504521e710" ON "users" ("username");
-- create "categories" table
CREATE TABLE "categories" (
  "id" character varying NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "type" "categories_type_enum" NOT NULL,
  "order" integer NOT NULL,
  "comment" character varying NULL,
  "user_id" character varying NOT NULL,
  "deleted_at" timestamp NULL,
  "icon" character varying NULL,
  "plan" integer NULL,
  "color" character varying NULL,
  "plan_period" "categories_plan_period_enum" NOT NULL DEFAULT 'month',
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- create "records" table
CREATE TABLE "records" (
  "id" character varying NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "amount" integer NOT NULL,
  "comment" character varying NULL,
  "timestamp" timestamp NOT NULL,
  "category_id" character varying NOT NULL,
  "deleted_at" timestamp NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_a4ee3e5c2423eb2ae4d6d778413" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- create "refresh_tokens" table
CREATE TABLE "refresh_tokens" (
  "id" character varying NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "refresh_token" character varying NOT NULL,
  "expires_at" timestamp NOT NULL,
  "user_id" character varying NULL,
  "deleted_at" timestamp NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

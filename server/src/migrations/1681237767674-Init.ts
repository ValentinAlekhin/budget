import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1681237767674 implements MigrationInterface {
  name = 'Init1681237767674'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "records" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "amount" integer NOT NULL, "comment" character varying, "timestamp" TIMESTAMP NOT NULL, "categoryId" character varying, "userId" character varying, CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('inc', 'cost', 'dist')`,
    )
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."categories_type_enum" NOT NULL, "comment" character varying, "userId" character varying, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_9237a6e731418bb2b6111d17fb1" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_b392510e8a9898d395a871bd9cf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741"`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_b392510e8a9898d395a871bd9cf"`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_9237a6e731418bb2b6111d17fb1"`,
    )
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "categories"`)
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`)
    await queryRunner.query(`DROP TABLE "records"`)
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRecordIndex1697034619387 implements MigrationInterface {
  name = 'AddRecordIndex1697034619387'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."categories_type_enum" RENAME TO "categories_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('inc', 'cost', 'adjustment')`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum" USING "type"::"text"::"public"."categories_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum_old"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_a4ee3e5c2423eb2ae4d6d77841" ON "records" ("category_id") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4ee3e5c2423eb2ae4d6d77841"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum_old" AS ENUM('inc', 'cost', 'dist', 'adjustment')`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum_old" USING "type"::"text"::"public"."categories_type_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."categories_type_enum_old" RENAME TO "categories_type_enum"`,
    )
  }
}

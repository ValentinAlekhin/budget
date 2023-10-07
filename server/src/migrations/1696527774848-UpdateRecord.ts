import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRecord1696527774848 implements MigrationInterface {
  name = 'UpdateRecord1696527774848'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM records WHERE type = 'dist';`)
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "type"`)
    await queryRunner.query(
      `ALTER TYPE "public"."categories_type_enum" RENAME TO "categories_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('inc', 'cost', 'dist', 'adjustment')`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum" USING "type"::"text"::"public"."categories_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum_old" AS ENUM('inc', 'cost', 'dist')`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum_old" USING "type"::"text"::"public"."categories_type_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."categories_type_enum_old" RENAME TO "categories_type_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ADD "type" character varying NOT NULL`,
    )
  }
}

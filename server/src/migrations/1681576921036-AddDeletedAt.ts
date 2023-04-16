import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAt1681576921036 implements MigrationInterface {
  name = 'AddDeletedAt1681576921036'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "records" ADD "deleted_at" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deleted_at" TIMESTAMP`,
    )
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "deleted_at" TIMESTAMP`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "deleted_at"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`)
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "deleted_at"`)
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "deleted_at"`)
  }
}

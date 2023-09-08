import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIcon1694188175138 implements MigrationInterface {
  name = 'AddIcon1694188175138'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "icon" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "icon"`)
  }
}

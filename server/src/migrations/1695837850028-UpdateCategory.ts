import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCategory1695837850028 implements MigrationInterface {
  name = 'UpdateCategory1695837850028'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" ADD "plan" integer`)
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "color" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_a4ee3e5c2423eb2ae4d6d778413"`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "category_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_a4ee3e5c2423eb2ae4d6d778413" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" DROP CONSTRAINT "FK_a4ee3e5c2423eb2ae4d6d778413"`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "category_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_a4ee3e5c2423eb2ae4d6d778413" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`)
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "plan"`)
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPlanPeriod1701187645122 implements MigrationInterface {
  name = 'AddPlanPeriod1701187645122'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_plan_period_enum" AS ENUM('day', 'week', 'month', 'quarter', 'year')`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "plan_period" "public"."categories_plan_period_enum" NOT NULL DEFAULT 'month'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "plan_period"`,
    )
    await queryRunner.query(`DROP TYPE "public"."categories_plan_period_enum"`)
  }
}

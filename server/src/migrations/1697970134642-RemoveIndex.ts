import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveIndex1697970134642 implements MigrationInterface {
  name = 'RemoveIndex1697970134642'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4ee3e5c2423eb2ae4d6d77841"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_a4ee3e5c2423eb2ae4d6d77841" ON "records" ("category_id") `,
    )
  }
}

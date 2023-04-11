import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnum1681151390784 implements MigrationInterface {
    name = 'ChangeEnum1681151390784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "records" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "timestamp"`);
    }

}

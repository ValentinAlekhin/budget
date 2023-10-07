import { MigrationInterface, QueryRunner } from 'typeorm'
import { UserEntity } from '@app/user/user.entity'
import { CategoryEntity } from '@app/category/category.entity'
import { CategoryTypeEnum } from '@app/common/enum'

export class CreateAdjustmentCategory1696529275963
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.manager.find(UserEntity)
    const adjustmentCategories = users.map((user) =>
      Object.assign(new CategoryEntity(), {
        name: 'Adjustment',
        type: CategoryTypeEnum.Adjustment,
        order: 0,
        comment: 'Service category',
        user,
      }),
    )
    await queryRunner.manager.save(adjustmentCategories)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adjustmentCategories = await queryRunner.manager.find(
      CategoryEntity,
      {
        where: { type: CategoryTypeEnum.Adjustment },
      },
    )
    await queryRunner.manager.remove(adjustmentCategories)
  }
}

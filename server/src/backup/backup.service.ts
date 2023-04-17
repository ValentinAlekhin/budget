import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { FindManyOptions, Repository } from 'typeorm'
import { CategoryEntity, CategoryTypeEnum } from '@app/category/category.entity'
import { parse } from 'csv-parse/sync'
import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import { UserType } from '@app/user/types/user.type'

dayjs.extend(customParseFormat)

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(RecordEntity)
    private recordRepo: Repository<RecordEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async restoreFromCsv(file: Express.Multer.File, user: UserType) {
    if (!file) {
      throw new HttpException('Нет файла', HttpStatus.BAD_REQUEST)
    }

    const [_, __, ...data] = (await parse(file.buffer)) as Array<Array<string>>

    const preparedData = data
      .filter((row) => row[0] && row[1] && row[2] && row[3])
      .map(([date, type, category, amount, comment]) => ({
        date: dayjs(date, 'DD-MM-YYYY'),
        type: type as CategoryTypeEnum,
        category,
        amount: parseInt(amount),
        comment,
      }))

    let categories = preparedData.reduce<CategoryEntity[]>(
      (acc, { type, category }) => {
        if (!['cost', 'inc'].includes(type)) {
          return acc
        }

        const exist = acc.find((c) => c.type === type && c.name === category)
        if (exist) {
          return acc
        }

        acc.push(
          this.categoryRepo.create({
            type,
            name: category,
            user: { id: user.id },
            order: acc.length,
          }),
        )

        return acc
      },
      [],
    )

    let records: RecordEntity[]

    await this.recordRepo.manager.transaction(async (manager) => {
      const findOptions: FindManyOptions<RecordEntity | CategoryEntity> = {
        where: { user: { id: user.id } },
      }

      const oldCategories = await manager.find(CategoryEntity, findOptions)
      await manager.remove(oldCategories)

      categories = await manager.save(categories)

      records = preparedData.map((item) =>
        this.recordRepo.create({
          ...item,
          type: item.type,
          timestamp: item.date.toDate(),
          category: { id: categories.find((c) => c.name === item.category).id },
        }),
      )

      records = await manager.save(records)
    })

    return { records, categories }
  }
}

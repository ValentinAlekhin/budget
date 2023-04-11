import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { Repository } from 'typeorm'
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
    const [_, __, ...data] = (await parse(file.buffer)) as Array<Array<string>>

    const preparedData = data
      .filter((row) => row[0] && row[1] && row[2] && row[3])
      .map(([date, type, category, amount, comment]) => ({
        date: dayjs(date, 'DD-MM-YYYY'),
        type,
        category,
        amount: parseInt(amount),
        comment,
      }))

    const categories = preparedData.reduce<
      Array<{ name: string; type: string; user: { id: number } }>
    >((acc, { type, category }) => {
      if (!['cost', 'inc'].includes(type)) {
        return acc
      }

      const exist = acc.find((c) => c.type === type && c.name === category)
      if (exist) {
        return acc
      }

      acc.push({ type, name: category, user })

      return acc
    }, []) as CategoryEntity[]

    const newCategories = this.categoryRepo.create(categories)
    await this.categoryRepo.save(newCategories)

    const records = preparedData.map((item) => ({
      ...item,
      type: item.type as unknown as CategoryTypeEnum,
      timestamp: item.date.toDate(),
      user,
      category: newCategories.find((c) => c.name === item.category),
    })) as unknown as RecordEntity

    let newRecords = this.recordRepo.create(records)
    newRecords = await this.recordRepo.save(newRecords)

    return { records: newRecords, categories: newCategories }
  }
}

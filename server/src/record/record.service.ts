import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryService } from '@app/category/category.service'
import { CreateRecordDto } from '@app/record/dto/createRecord.dto'

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
  ) {}

  async find(user): Promise<any> {
    const records = await this.recordRepository.find({
      relations: ['user', 'category'],
      where: { user: { id: user.id } },
    })

    return records.map((record) => {
      delete record.user

      return {
        ...record,
        category: record.category.id,
      }
    })
  }

  async create(user, createRecordDto: CreateRecordDto): Promise<RecordEntity> {
    const category = await this.categoryService.findOne(
      user,
      createRecordDto.category,
    )

    const record = new RecordEntity()
    Object.assign(record, { ...createRecordDto, category, user })

    return await this.recordRepository.save(record)
  }

  buildRecordResponse(record) {
    if (record.user) delete record.user

    return { ...record, category: record.category.id }
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryService } from '@app/category/category.service'
import { CreateRecordDto } from '@app/record/dto/createRecord.dto'
import { UserEntity } from '@app/user/user.entity'
import { RecordNotFoundException } from '@app/record/exceptions/record-not-found.exception'
import { UpdateRecordDto } from '@app/record/dto/updateRecord.dto'
import { RecordResponseDto } from '@app/record/dto/recordResponse.dto'

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
  ) {}
  async find(user): Promise<RecordResponseDto[]> {
    const records = await this.recordRepository.find({
      relations: ['category'],
      where: { category: { user: { id: user.id } } },
      order: { timestamp: 'desc' },
    })

    return records.map((r) => this.buildRecordResponse(r))
  }

  async create(user, createRecordDto: CreateRecordDto): Promise<RecordEntity> {
    const category = await this.categoryService.findOneByIdAndUserId(
      createRecordDto.category,
      user.id,
    )

    const record = new RecordEntity()
    Object.assign(record, { ...createRecordDto, category, user })

    return await this.recordRepository.save(record)
  }

  async updateOne(
    user: UserEntity,
    id: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<RecordEntity> {
    const record = await this.findOneByIdAndUserId(id, user.id)
    const category = await this.categoryService.findOneByIdAndUserId(
      updateRecordDto.category,
      user.id,
    )

    Object.assign(record, { ...updateRecordDto, category })
    return this.recordRepository.save(record)
  }

  async deleteOne(id: string, user: UserEntity): Promise<RecordEntity> {
    const record = await this.findOneByIdAndUserId(id, user.id)
    await this.recordRepository.remove(record)

    return record
  }

  buildRecordResponse(record): RecordResponseDto {
    if (record.user) {
      delete record.user
    }

    return { ...record, category: record.category.id }
  }

  async findOneByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<RecordEntity> {
    const record = await this.recordRepository.findOne({
      relations: ['category'],
      where: {
        id,
        category: {
          user: {
            id: userId,
          },
        },
      },
    })

    if (!record) {
      throw new RecordNotFoundException(id)
    }

    return record
  }
}

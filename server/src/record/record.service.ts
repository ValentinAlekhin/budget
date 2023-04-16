import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryService } from '@app/category/category.service'
import { CreateRecordDto } from '@app/record/dto/createRecord.dto'
import { UserEntity } from '@app/user/user.entity'
import { RecordNotFoundException } from '@app/record/exceptions/record-not-found.exception'
import { UpdateRecordDto } from '@app/record/dto/updateRecord.dto'
import { RecordResponseDto } from '@app/record/dto/recordResponse.dto'
import { RecordGateway } from '@app/record/record.gateway'
import { CreateManyRecordsDto } from '@app/record/dto/createManyRecords.dto'
import { keyBy } from 'lodash'

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    private recordGateway: RecordGateway,
  ) {}
  async find(user): Promise<RecordResponseDto[]> {
    const records = await this.recordRepository.find({
      relations: ['category'],
      where: { category: { user: { id: user.id }, deletedAt: IsNull() } },
      order: { timestamp: 'desc' },
    })

    return records.map((r) => this.buildRecordResponse(r))
  }

  async create(
    user,
    createRecordDto: CreateRecordDto,
  ): Promise<RecordResponseDto> {
    const category = await this.categoryService.findOneByIdAndUserId(
      createRecordDto.category,
      user.id,
    )

    let record = new RecordEntity()
    Object.assign(record, { ...createRecordDto, category, user })

    record = await this.recordRepository.save(record)

    const response = this.buildRecordResponse(record)

    this.recordGateway.createRecord(response, user.id)

    return response
  }

  async createMany(
    user,
    createManyRecordsDto: CreateManyRecordsDto,
  ): Promise<RecordResponseDto[]> {
    const categoryIds = createManyRecordsDto.data.map((r) => r.category)
    const categories = await this.categoryService.findManyByIdsAndUserId(
      categoryIds,
      user.id,
    )

    if (categoryIds.length !== categories.length) {
      throw new HttpException('Нет таких категорий', HttpStatus.BAD_REQUEST)
    }

    const categoriesObj = keyBy(categories, 'id')

    let records = createManyRecordsDto.data.map((r) =>
      this.recordRepository.create({
        amount: r.amount,
        timestamp: r.timestamp,
        type: r.type,
        category: categoriesObj[r.category],
        comment: r.comment,
      }),
    )

    records = await this.recordRepository.save(records)

    const response = records.map((r) => this.buildRecordResponse(r))

    this.recordGateway.createManyRecord(response, user.id)

    return response
  }

  async updateOne(
    user: UserEntity,
    id: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<RecordResponseDto> {
    let record = await this.findOneByIdAndUserId(id, user.id)
    const category = await this.categoryService.findOneByIdAndUserId(
      updateRecordDto.category,
      user.id,
    )

    Object.assign(record, { ...updateRecordDto, category })
    record = await this.recordRepository.save(record)

    const response = this.buildRecordResponse(record)

    this.recordGateway.updateRecord(response, user.id)

    return response
  }

  async deleteOne(id: string, user: UserEntity): Promise<RecordResponseDto> {
    const record = await this.findOneByIdAndUserId(id, user.id)
    await this.recordRepository.remove(record)

    const response = this.buildRecordResponse({ ...record, id })
    this.recordGateway.deleteRecord(response, user.id)

    return response
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

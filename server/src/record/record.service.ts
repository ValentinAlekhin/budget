import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, IsNull, Repository } from 'typeorm'
import { keyBy } from 'lodash'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { AdjustmentDto } from '@app/record/dto/adjustmentDto'
import * as dayjs from 'dayjs'
import { CategoryService } from '../category/category.service'
import { UserEntity } from '../user/user.entity'
import { RecordEntity } from './record.entity'
import { RecordGateway } from './record.gateway'
import { RecordResponseDto } from './dto/recordResponse.dto'
import { CreateRecordDto } from './dto/createRecord.dto'
import { CreateManyRecordsDto } from './dto/createManyRecords.dto'
import { UpdateRecordDto } from './dto/updateRecord.dto'
import { RecordNotFoundException } from './exceptions/record-not-found.exception'

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    private recordGateway: RecordGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async find(user): Promise<RecordEntity[]> {
    const cache = await this.getCache(user.id)
    if (cache) {
      return cache
    }

    const records = await this.recordRepository.find({
      where: {
        category: { user: { id: user.id }, deletedAt: IsNull() },
      },
      order: { timestamp: 'desc' },
    })

    const response = records.map((r) => this.buildRecordResponse(r))

    this.setCache(user.id, response)

    return records
  }

  async create(
    user,
    createRecordDto: CreateRecordDto,
  ): Promise<RecordResponseDto> {
    await this.cacheManager.del(this.getCacheKey(user.id))

    const category = await this.categoryService.findOneByIdAndUserId(
      createRecordDto.categoryId,
      user.id,
    )

    let record = new RecordEntity()
    Object.assign(record, { ...createRecordDto, category, user })

    record = await this.recordRepository.save(record)
    record = await this.recordRepository.findOne({ where: { id: record.id } })

    const response = this.buildRecordResponse(record)

    this.recordGateway.createRecord(response, user.id)

    return response
  }

  async createMany(
    user,
    createManyRecordsDto: CreateManyRecordsDto,
  ): Promise<RecordResponseDto[]> {
    await this.cacheManager.del(this.getCacheKey(user.id))

    const categoryIds = createManyRecordsDto.data.map((r) => r.categoryId)
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
        category: categoriesObj[r.categoryId],
        comment: r.comment,
      }),
    )

    records = await this.recordRepository.save(records)
    records = await this.recordRepository.find({
      where: { id: In(records.map((r) => r.id)) },
    })

    const response = records.map((r) => this.buildRecordResponse(r))

    this.recordGateway.createManyRecord(response, user.id)

    return response
  }

  async updateOne(
    user: UserEntity,
    id: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<RecordResponseDto> {
    await this.cacheManager.del(this.getCacheKey(user.id))

    let record = await this.findOneByIdAndUserId(id, user.id)
    const category = await this.categoryService.findOneByIdAndUserId(
      updateRecordDto.categoryId,
      user.id,
    )

    Object.assign(record, { ...updateRecordDto, category })
    await this.recordRepository.save(record)
    record = await this.recordRepository.findOne({ where: { id } })

    const response = this.buildRecordResponse(record)

    this.recordGateway.updateRecord(response, user.id)

    return response
  }

  async deleteOne(id: string, user: UserEntity): Promise<RecordResponseDto> {
    await this.cacheManager.del(this.getCacheKey(user.id))

    const record = await this.findOneByIdAndUserId(id, user.id)
    await this.recordRepository.remove(record)

    const response = this.buildRecordResponse({ ...record, id })
    this.recordGateway.deleteRecord(response, user.id)

    return response
  }

  async adjustment(
    user: UserEntity,
    { diff }: AdjustmentDto,
  ): Promise<RecordResponseDto> {
    await this.cacheManager.del(this.getCacheKey(user.id))

    const category = await this.categoryService.getAdjustmentCategory(user)
    let record = this.recordRepository.create({
      category,
      amount: diff,
      timestamp: dayjs(),
    })
    record = await this.recordRepository.save(record)
    const response = this.buildRecordResponse(record)
    this.recordGateway.createManyRecord([response], user.id)
    return response
  }

  buildRecordResponse(record): RecordResponseDto {
    if (record.user) {
      delete record.user
    }

    if (record.category) {
      delete record.category
    }

    return { ...record }
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

  private async getCache(userId: string) {
    const data = await this.cacheManager.get(this.getCacheKey(userId))
    if (data) {
      return JSON.parse(<string>data)
    }

    return null
  }

  private async setCache(userId: string, data: RecordResponseDto[]) {
    const json = JSON.stringify(data)
    await this.cacheManager.set(this.getCacheKey(userId), json)
  }

  private getCacheKey(userId: string) {
    return `records_${userId}`
  }
}

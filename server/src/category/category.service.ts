import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, IsNull, Repository } from 'typeorm'
import * as dayjs from 'dayjs'
import { UserEntity } from 'src/user/user.entity'
import { CategoryTypeEnum } from '@app/common/enum'
import { CategoryEntity } from './category.entity'
import { CategoryGateway } from './category.gateway'
import { CreateCategoryDto } from './dto/createCategory.dto'
import { CategoryNotFoundException } from './exceptions/category-not-found.exception'
import { UpdateManyCategoriesDto } from './dto/updateManyCategories.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private categoryGateway: CategoryGateway,
  ) {}

  async find(user): Promise<CategoryEntity[]> {
    const categories = await this.repo.find({
      relations: ['user'],
      where: {
        user: { id: user.id },
        deletedAt: IsNull(),
      },
    })

    return categories.map((category) => {
      delete category.user

      return category
    })
  }

  async create(
    user,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity()
    Object.assign(category, { ...createCategoryDto, user })

    const response = await this.repo.save(category)

    this.categoryGateway.createCategory(response, user.id)

    return response
  }

  async deleteOne(user: UserEntity, id: string): Promise<CategoryEntity> {
    const category = await this.findOneByIdAndUserId(id, user.id)

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    await this.repo.save({
      ...category,
      deletedAt: dayjs().toDate(),
    })

    this.categoryGateway.deleteCategory(category, user.id)

    return category
  }

  async updateOne(
    user: UserEntity,
    id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOneByIdAndUserId(id, user.id)

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    Object.assign(category, createCategoryDto)
    const response = await this.repo.save(category)

    this.categoryGateway.updateCategory(response, user.id)

    return response
  }

  async updateMany(
    user: UserEntity,
    updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<CategoryEntity[]> {
    const ids = updateManyCategoriesDto.data.map(({ id }) => id)
    const categories = await this.repo.find({
      where: { user: { id: user.id }, id: In(ids) },
    })

    if (categories.length !== ids.length) {
      throw new CategoryNotFoundException(ids.join(', '))
    }

    const response = await this.repo.save(updateManyCategoriesDto.data)

    this.categoryGateway.updateManyCategory(response, user.id)

    return response
  }

  buildCategoryResponse(category: CategoryEntity) {
    if (category.user) {
      delete category.user
    }

    return category
  }

  async findOneByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<CategoryEntity> {
    const category = await this.repo.findOne({
      relations: ['user'],
      where: { id, user: { id: userId } },
    })

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    return category
  }

  async findManyByIdsAndUserId(
    ids: string[],
    userId: string,
  ): Promise<CategoryEntity[]> {
    return await this.repo.find({
      relations: ['user'],
      where: { id: In(ids), user: { id: userId } },
    })
  }

  async createAdjustment(user: UserEntity): Promise<CategoryEntity> {
    const category = this.repo.create({
      name: 'adjustment',
      type: CategoryTypeEnum.Adjustment,
      user,
      comment: 'Service category',
    })
    return this.repo.save(category)
  }

  async getAdjustmentCategory(user: UserEntity): Promise<CategoryEntity> {
    const category = await this.repo.findOne({
      where: { user: { id: user.id }, type: CategoryTypeEnum.Adjustment },
    })

    if (!category) {
      return this.createAdjustment(user)
    }

    return category
  }
}

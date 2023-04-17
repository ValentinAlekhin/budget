import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, IsNull, Repository } from 'typeorm'
import { CreateCategoryDto } from '@app/category/dto/createCategory.dto'
import { CategoryEntity } from '@app/category/category.entity'
import { UserEntity } from '@app/user/user.entity'
import { CategoryNotFoundException } from '@app/category/exceptions/category-not-found.exception'
import { CategoryGateway } from '@app/category/category.gateway'
import * as dayjs from 'dayjs'
import { UpdateManyCategoriesDto } from '@app/category/dto/updateManyCategories.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private categoryGateway: CategoryGateway,
  ) {}

  async find(user): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      relations: ['user'],
      where: { user: { id: user.id }, deletedAt: IsNull() },
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

    const response = await this.categoryRepository.save(category)

    this.categoryGateway.createCategory(response, user.id)

    return response
  }

  async deleteOne(user: UserEntity, id: string): Promise<CategoryEntity> {
    const category = await this.findOneByIdAndUserId(id, user.id)

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    await this.categoryRepository.save({
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
    const response = await this.categoryRepository.save(category)

    this.categoryGateway.updateCategory(response, user.id)

    return response
  }

  async updateMany(
    user: UserEntity,
    updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<CategoryEntity[]> {
    const ids = updateManyCategoriesDto.data.map(({ id }) => id)
    const categories = await this.categoryRepository.find({
      where: { user: { id: user.id }, id: In(ids) },
    })

    if (categories.length !== ids.length) {
      throw new CategoryNotFoundException(ids.join(', '))
    }

    const response = await this.categoryRepository.save(
      updateManyCategoriesDto.data,
    )

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
    const category = await this.categoryRepository.findOne({
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
    return await this.categoryRepository.find({
      relations: ['user'],
      where: { id: In(ids), user: { id: userId } },
    })
  }
}

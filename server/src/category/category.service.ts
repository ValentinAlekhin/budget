import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCategoryDto } from '@app/category/dto/createCategory.dto'
import { CategoryEntity } from '@app/category/category.entity'
import { UserEntity } from '@app/user/user.entity'
import { CategoryNotFoundException } from '@app/category/exceptions/category-not-found.exception'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async find(user): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find({
      relations: ['user'],
      where: { user: { id: user.id } },
    })

    return categories.map((category) => {
      delete category.user

      return category
    })
  }

  async findOne(user, id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    })

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    return category
  }

  async create(
    user,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity()
    Object.assign(category, { ...createCategoryDto, user })

    return await this.categoryRepository.save(category)
  }

  async deleteOne(user, id: string): Promise<CategoryEntity> {
    const category = await this.findOne(user, id)

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    await this.categoryRepository.remove(category)

    return category
  }

  async updateOne(
    user,
    id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(user, id)

    if (!category) {
      throw new CategoryNotFoundException(id)
    }

    Object.assign(category, createCategoryDto)
    return await this.categoryRepository.save(category)
  }

  buildCategoryResponse(category: CategoryEntity) {
    if (category.user) {
      delete category.user
    }

    return category
  }
}

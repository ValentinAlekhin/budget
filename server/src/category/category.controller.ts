import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import { CategoryService } from '@app/category/category.service'
import { CategoryEntity } from '@app/category/category.entity'
import { CreateCategoryDto } from '@app/category/dto/createCategory.dto'
import { ApiTags } from '@nestjs/swagger'
import { UpdateManyCategoriesDto } from '@app/category/dto/updateManyCategories.dto'

@Controller('category')
@UseGuards(JwtAuthGuard)
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async find(@Req() req): Promise<CategoryEntity[]> {
    return await this.categoryService.find(req.user)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoryService.create(
      req.user,
      createCategoryDto,
    )
    return this.categoryService.buildCategoryResponse(category)
  }

  @Put('many')
  @UsePipes(new ValidationPipe())
  async updateMany(
    @Req() req,
    @Body() updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<CategoryEntity[]> {
    const categories = await this.categoryService.updateMany(
      req.user,
      updateManyCategoriesDto,
    )
    return categories.map((c) => this.categoryService.buildCategoryResponse(c))
  }

  @Delete(':id')
  async deleteOne(
    @Req() req,
    @Param('id') id: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoryService.deleteOne(req.user, id)
    return this.categoryService.buildCategoryResponse(category)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoryService.updateOne(
      req.user,
      id,
      createCategoryDto,
    )
    return this.categoryService.buildCategoryResponse(category)
  }
}

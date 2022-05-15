import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from '@app/category/category.entity'
import { UserEntity } from '@app/user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

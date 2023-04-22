import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from '@app/category/category.entity'
import { UserEntity } from '@app/user/user.entity'
import { CategoryGateway } from '@app/category/category.gateway'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryGateway],
  exports: [CategoryService, CategoryGateway],
})
export class CategoryModule {}

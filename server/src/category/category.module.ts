import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { CategoryEntity } from './category.entity'
import { CategoryGateway } from './category.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryGateway],
  exports: [CategoryService, CategoryGateway],
})
export class CategoryModule {}

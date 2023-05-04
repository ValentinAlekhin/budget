import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryModule } from '../category/category.module'
import { RecordController } from './record.controller'
import { RecordService } from './record.service'
import { RecordEntity } from './record.entity'
import { RecordGateway } from './record.gateway'

@Module({
  providers: [RecordGateway, RecordService],
  controllers: [RecordController],
  imports: [TypeOrmModule.forFeature([RecordEntity]), CategoryModule],
  exports: [RecordGateway],
})
export class RecordModule {}

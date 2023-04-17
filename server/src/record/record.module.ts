import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryModule } from '@app/category/category.module'
import { RecordGateway } from '@app/record/record.gateway'
import { RecordController } from './record.controller'
import { RecordService } from './record.service'

@Module({
  providers: [RecordGateway, RecordService],
  controllers: [RecordController],
  imports: [TypeOrmModule.forFeature([RecordEntity]), CategoryModule],
})
export class RecordModule {}

import { Module } from '@nestjs/common'
import { RecordService } from './record.service'
import { RecordController } from './record.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryModule } from '@app/category/category.module'

@Module({
  providers: [RecordService],
  controllers: [RecordController],
  imports: [TypeOrmModule.forFeature([RecordEntity]), CategoryModule],
})
export class RecordModule {}

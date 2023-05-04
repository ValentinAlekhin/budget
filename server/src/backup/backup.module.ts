import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecordEntity } from '../record/record.entity'
import { CategoryEntity } from '../category/category.entity'
import { BackupController } from './backup.controller'
import { BackupService } from './backup.service'

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity, CategoryEntity])],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}

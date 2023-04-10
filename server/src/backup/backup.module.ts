import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { CategoryEntity } from '@app/category/category.entity'
import { BackupController } from '@app/backup/backup.controller'
import { BackupService } from '@app/backup/backup.service'

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity, CategoryEntity])],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}

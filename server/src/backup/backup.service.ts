import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RecordEntity } from '@app/record/record.entity'
import { Repository } from 'typeorm'
import { CategoryEntity } from '@app/category/category.entity'

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(RecordEntity) recordRepo: Repository<RecordEntity>,
    @InjectRepository(CategoryEntity) categoryRepo: Repository<CategoryEntity>,
  ) {}

  async restoreFromCsv(file: Express.Multer.File) {
    console.log(file)
  }
}

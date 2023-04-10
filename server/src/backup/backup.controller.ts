import { BackupService } from '@app/backup/backup.service'
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('backup')
export class BackupController {
  constructor(private service: BackupService) {}

  @Post('restore/csv')
  @UseInterceptors(FileInterceptor('file'))
  restoreFromCsv(@UploadedFile() file: Express.Multer.File) {
    return this.service.restoreFromCsv(file)
  }
}

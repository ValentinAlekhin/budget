import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BackupService } from './backup.service'

@Controller('backup')
@UseGuards(JwtAuthGuard)
export class BackupController {
  constructor(private service: BackupService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  restoreFromCsv(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.service.restoreFromCsv(file, req.user)
  }
}

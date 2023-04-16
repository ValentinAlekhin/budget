import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { RecordService } from '@app/record/record.service'
import { CreateRecordDto } from '@app/record/dto/createRecord.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import { RecordResponseDto } from '@app/record/dto/recordResponse.dto'
import { UpdateRecordDto } from '@app/record/dto/updateRecord.dto'
import { CreateManyRecordsDto } from '@app/record/dto/createManyRecords.dto'

@Controller('records')
@UseGuards(JwtAuthGuard)
@ApiTags('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async find(@Req() req): Promise<RecordResponseDto[]> {
    return await this.recordService.find(req.user)
  }

  @Post()
  create(
    @Req() req,
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<RecordResponseDto> {
    return this.recordService.create(req.user, createRecordDto)
  }

  @Post('many')
  createMany(
    @Req() req,
    @Body() createManyRecordsDto: CreateManyRecordsDto,
  ): Promise<RecordResponseDto[]> {
    return this.recordService.createMany(req.user, createManyRecordsDto)
  }

  @Delete(':id')
  deleteOne(@Req() req, @Param('id') id: string): Promise<RecordResponseDto> {
    return this.recordService.deleteOne(id, req.user)
  }

  @Put(':id')
  updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ): Promise<RecordResponseDto> {
    return this.recordService.updateOne(req.user, id, updateRecordDto)
  }
}

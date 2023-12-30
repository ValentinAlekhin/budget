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
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AdjustmentDto } from '@app/record/dto/adjustmentDto'
import { RecordService } from './record.service'
import { RecordResponseDto } from './dto/recordResponse.dto'
import { CreateRecordDto } from './dto/createRecord.dto'
import { CreateManyRecordsDto } from './dto/createManyRecords.dto'
import { UpdateRecordDto } from './dto/updateRecord.dto'

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

  @Post('adjustment')
  adjustment(
    @Req() req,
    @Body() adjustmentDto: AdjustmentDto,
  ): Promise<RecordResponseDto> {
    return this.recordService.adjustment(req.user, adjustmentDto)
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

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { RecordService } from '@app/record/record.service'
import { CreateRecordDto } from '@app/record/dto/createRecord.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import { RecordResponseDto } from '@app/record/dto/recordResponse.dto'

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
  @UsePipes(new ValidationPipe())
  async create(
    @Req() req,
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<RecordResponseDto> {
    const record = await this.recordService.create(req.user, createRecordDto)
    return this.recordService.buildRecordResponse(record)
  }

  // @Delete(':id')
  // async deleteOne(
  //   @Req() req,
  //   @Param('id') id: number,
  // ): Promise<CategoryEntity> {
  //   const record = await this.recordService.deleteOne(req.user, id)
  //   return this.recordService.buildRecordResponse(record)
  // }
  //
  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // async updateOne(
  //   @Req() req,
  //   @Param('id') id: number,
  //   @Body() createRecordDto: CreateRecordDto,
  // ): Promise<CategoryEntity> {
  //   const record = await this.recordService.updateOne(
  //     req.user,
  //     id,
  //     createRecordDto,
  //   )
  //   return this.recordService.buildRecordResponse(record)
  // }
}

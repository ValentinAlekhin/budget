import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import { ApiTags } from '@nestjs/swagger'
import { UserEntity } from '@app/user/user.entity'
import { CreateUserDto } from '@app/user/dto/createUser.dto'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(createUserDto)
  }
}

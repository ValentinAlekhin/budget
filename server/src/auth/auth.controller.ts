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
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserType } from '../user/types/user.type'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginUserDto } from './dto/loginUser.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refreshToken.guard'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { JwtTokensType } from './types/JwtTokens.type'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req): UserType {
    return req.user
  }

  @Post('refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  @UsePipes(new ValidationPipe())
  refreshTokens(
    @Body() refreshTokensDto: RefreshTokenDto,
    @Req() req,
  ): Promise<JwtTokensType> {
    return this.authService.refreshTokens(refreshTokensDto, req.user)
  }
}

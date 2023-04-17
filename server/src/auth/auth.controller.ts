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
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard'
import { AuthService } from '@app/auth/auth.service'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserType } from '@app/user/types/user.type'
import { LoginUserDto } from '@app/auth/dto/loginUser.dto'
import { RefreshTokenDto } from '@app/auth/dto/refreshToken.dto'
import { RefreshTokenGuard } from '@app/auth/guards/refreshToken.guard'
import { JwtTokensType } from '@app/auth/types/JwtTokens.type'

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

import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard'
import { AuthService } from '@app/auth/auth.service'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserType } from '@app/user/types/user.type'
import { AuthUserType } from '@app/auth/types/AuthUser.type'
import { LoginUserDto } from '@app/auth/dto/loginUser.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  login(@Req() req): AuthUserType {
    return this.authService.login(req.user)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req): UserType {
    return req.user
  }
}

import { Module } from '@nestjs/common'
import { UserModule } from '@app/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '@app/auth/strategies/local.strategy'
import { AccessTokenStrategy } from '@app/auth/strategies/accessToken.strategy'
import { RefreshTokenStrategy } from '@app/auth/strategies/refreshToken.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenEntity } from '@app/auth/token.entity'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}

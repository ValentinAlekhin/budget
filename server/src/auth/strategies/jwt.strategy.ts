import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '@app/auth/auth.service'
import { omit } from 'lodash'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    })
  }

  async validate(payload: any) {
    const user = await this.authService.userExists(payload.id)
    if (!user) {
      throw new UnauthorizedException()
    }

    return omit(user, 'password')
  }
}

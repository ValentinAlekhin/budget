import { Injectable } from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { UserEntity } from '@app/user/user.entity'
import { toPlainObject } from 'lodash'
import { AuthUserType } from '@app/auth/types/AuthUser.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username)

    const isPasswordValid = await compare(password, user.password)
    if (user && isPasswordValid) return user

    return null
  }

  login(user: UserEntity): AuthUserType {
    delete user.password

    return {
      ...user,
      access_token: this.jwtService.sign(toPlainObject(user)),
    }
  }
}

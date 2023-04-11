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

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByUsername(username)

    if (!user) {
      return null
    }

    const isPasswordValid = await compare(password, user.password)
    if (isPasswordValid) {
      return user
    }

    return null
  }

  login(user: UserEntity): AuthUserType {
    delete user.password

    return {
      user,
      accessToken: this.jwtService.sign(toPlainObject(user)),
    }
  }

  async userExists(id: string): Promise<UserEntity | false> {
    try {
      return await this.usersService.findById(id)
    } catch {
      return false
    }
  }
}

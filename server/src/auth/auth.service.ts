import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from '@app/user/user.entity'
import { pick } from 'lodash'
import { AuthUserType } from '@app/auth/types/AuthUser.type'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import { JwtTokensType } from '@app/auth/types/JwtTokens.type'
import { RefreshTokenDto } from '@app/auth/dto/refreshToken.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TokenEntity } from '@app/auth/token.entity'
import * as dayjs from 'dayjs'
import { hash, verifyHash } from '@app/common/utils/hash'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByUsername(username)

    if (!user) {
      return null
    }

    const isPasswordValid = await verifyHash(password, user.password)
    if (isPasswordValid) {
      return user
    }

    return null
  }

  async login(user: UserEntity): Promise<AuthUserType> {
    delete user.password

    const tokens = await this.getTokens(user)

    return {
      user,
      ...tokens,
    }
  }

  async refreshTokens(
    { refreshToken }: RefreshTokenDto,
    user: UserEntity,
  ): Promise<JwtTokensType> {
    const { valid, token: validToken } = await this.validateRefreshToken(
      refreshToken,
      user.id,
    )

    if (!valid) {
      throw new ForbiddenException('Невалидный токен')
    }

    await this.tokenRepo.remove(validToken)

    return await this.getTokens(user)
  }

  async userExists(id: string): Promise<UserEntity | false> {
    try {
      return await this.usersService.findById(id)
    } catch {
      return false
    }
  }

  async authenticateToken(token: string) {
    const payload = jwt.verify(
      token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    ) as UserEntity

    return this.usersService.findById(payload.id)
  }

  private async getTokens(user: UserEntity): Promise<JwtTokensType> {
    const payload = pick(user, ['id', 'username', 'email', 'createdAt'])

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    ])

    const newTokenRecord = this.tokenRepo.create({
      refreshToken: await hash(refreshToken),
      user: { id: user.id },
      expiresAt: dayjs().add(7, 'd').toDate(),
    })
    await this.tokenRepo.save(newTokenRecord)

    return {
      accessToken,
      refreshToken,
    }
  }

  private async validateRefreshToken(
    token: string,
    userId: string,
  ): Promise<{ valid: boolean; token: TokenEntity | null }> {
    const currentTokens = await this.tokenRepo.find({
      where: { user: { id: userId } },
    })

    if (!currentTokens.length) {
      return { valid: false, token: null }
    }

    const validatedTokens = await Promise.all(
      currentTokens.map(async (t) => {
        const valid = verifyHash(token, t.refreshToken)

        return { ...t, valid }
      }),
    )

    const validToken = validatedTokens.find((t) => t.valid)

    if (!validToken) {
      return { valid: false, token: null }
    }

    return {
      valid: true,
      token: currentTokens.find((t) => t.id === validToken.id),
    }
  }
}

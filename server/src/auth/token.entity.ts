import { Column, Entity, ManyToOne } from 'typeorm'
import { AbstractEntity } from '@app/common/abstract-entity'
import { UserEntity } from '@app/user/user.entity'

@Entity('refresh_tokens')
export class TokenEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: UserEntity

  @Column()
  refreshToken: string

  @Column('timestamp')
  expiresAt: Date
}

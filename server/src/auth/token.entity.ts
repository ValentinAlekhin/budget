import { Column, Entity, ManyToOne } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { AbstractEntity } from '../common/abstract-entity'

@Entity('refresh_tokens')
export class TokenEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: UserEntity

  @Column()
  refreshToken: string

  @Column('timestamp')
  expiresAt: Date
}

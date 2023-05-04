import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsULID, isULID } from '@yuzu441/is-ulid'
import { Transform } from 'class-transformer'
import { ulid } from 'ulidx'
import { IsOptional } from 'class-validator'
import { time } from '@app/common/time'

export class AbstractEntity extends BaseEntity {
  @PrimaryColumn({ unique: true })
  @IsULID()
  @Transform(({ value }) => value ?? ulid())
  @IsOptional()
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  deletedAt: Date

  @BeforeInsert()
  generateId() {
    this.id = isULID(this.id) ? this.id : ulid()

    const date = time().add(3, 'hour').toDate()
    this.createdAt = date
    this.updatedAt = date
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = time().add(3, 'hour').toDate()
  }
}

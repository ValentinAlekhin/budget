import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsULID, isULID } from '@yuzu441/is-ulid'
import { Transform } from 'class-transformer'
import { ulid } from 'ulidx'
import { IsOptional } from 'class-validator'

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

  @BeforeInsert()
  generateId() {
    this.id = isULID(this.id) ? this.id : ulid()
  }
}

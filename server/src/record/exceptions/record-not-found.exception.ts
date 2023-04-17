import { NotFoundException } from '@nestjs/common'

export class RecordNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Запись с "${id}" не найдена`)
  }
}

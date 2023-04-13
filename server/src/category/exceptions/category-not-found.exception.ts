import { NotFoundException } from '@nestjs/common'

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Катеригория с id "${id}" не найдена`)
  }
}

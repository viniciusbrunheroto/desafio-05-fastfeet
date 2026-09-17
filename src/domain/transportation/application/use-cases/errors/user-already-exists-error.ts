import { UseCaseError } from '#src/core/errors/use-case-error.js'
import { CPF } from '#src/domain/transportation/enterprise/entities/value-objects/cpf.js'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: CPF | string) {
    super(`User with CPF "${identifier} already exists.`)
  }
}
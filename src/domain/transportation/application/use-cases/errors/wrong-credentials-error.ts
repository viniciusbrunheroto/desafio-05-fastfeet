import { UseCaseError } from '#src/core/errors/use-case-error.js'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid.')
  }
}
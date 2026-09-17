import { UseCaseError } from '#src/core/errors/use-case-error.js'

export class InvalidOrderStatusError extends Error implements UseCaseError {
  constructor() {
    super('Invalid order status.')
  }
}
import { UseCaseError } from '#src/core/errors/use-case-error.js'

export class InvalidFileTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
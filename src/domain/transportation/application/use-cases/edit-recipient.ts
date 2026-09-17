import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { RecipientsRepository } from '../repositories/recipient-repository.js'
import { CEP } from '../../enterprise/entities/value-objects/cep.js'


interface EditRecipientUseCaseRequest {
    recipientId: string
    name?: string
    street?: string,
    neighborhood?: string,
    city?: string,
    state?: string,
    cep?: string,
} 

type EditRecipientUseCaseResponse = Either <
UserAlreadyExistsError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class EditRecipientUseCase {
  constructor (
        private recipientsRepository: RecipientsRepository
  ){}

  async execute({
    recipientId,
    name,
    street,
    neighborhood,
    city,
    state,
    cep
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse>{
    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient) {
      return left(new ResourceNotFoundError())
    }

    if (name !== undefined) {
      recipient.name = name
    }

    if (street !== undefined) {
      recipient.street = street
    }

    if (neighborhood !== undefined) {
      recipient.neighborhood = neighborhood
    }

    if (city !== undefined) {
      recipient.city = city
    }

    if (state !== undefined) {
      recipient.state = state
    }

    if (cep !== undefined) {
      recipient.cep = CEP.create(cep)
    }
 
    await this.recipientsRepository.save(recipient)
  
    return right({})
  }
}
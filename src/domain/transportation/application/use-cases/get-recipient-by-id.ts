import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { Recipient } from '../../enterprise/entities/recipient.js'
import { RecipientsRepository } from '../repositories/recipient-repository.js'


interface GetRecipientByIdUseCaseRequest {
   recipientId: string
} 

type GetRecipientByIdUseCaseResponse = Either <
ResourceNotFoundError,
{
   recipient: Recipient
}>

@Injectable()
export class GetRecipientByIdUseCase {
  constructor (
        private recipientsRepository: RecipientsRepository
  ){}

  async execute({
    recipientId
  }: GetRecipientByIdUseCaseRequest): Promise<GetRecipientByIdUseCaseResponse>{
    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient) {
      return left(new ResourceNotFoundError())
    }
  
    return right({
      recipient,
    })
  }
}
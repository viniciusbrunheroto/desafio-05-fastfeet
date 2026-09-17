import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { RecipientsRepository } from '../repositories/recipient-repository.js'


interface DeleteRecipientUseCaseRequest {
    recipientId: string
} 

type DeleteRecipientUseCaseResponse = Either <
ResourceNotFoundError,
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class DeleteRecipientUseCase {
  constructor (
        private recipientsRepository: RecipientsRepository
  ){}

  async execute({
    recipientId
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse>{
   
    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)
  
    return right({})
  }
}
import { Either, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipient-repository.js'
import { Recipient } from '../../enterprise/entities/recipient.js'
import { CEP } from '../../enterprise/entities/value-objects/cep.js'

interface CreateRecipientUseCaseRequest {
    name: string
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    cep: string,
}

type CreateRecipientUseCaseResponse = Either<
null,  
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
        private recipientsRepository: RecipientsRepository,
  ) {}


  async execute({
    name,
    street,
    neighborhood,
    city,
    state,
    cep
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
   
   
    const recipient = Recipient.create({
      name,
      street,
      neighborhood,
      city,
      state,
      cep: CEP.create(cep),
    })

    await this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
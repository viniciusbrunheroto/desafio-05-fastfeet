import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository.js'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'


interface DeleteDeliveryPersonUseCaseRequest {
    deliveryPersonId: string
} 

type DeleteDeliveryPersonUseCaseResponse = Either <
ResourceNotFoundError,
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class DeleteDeliveryPersonUseCase {
  constructor (
        private usersRepository: UsersRepository
  ){}

  async execute({
    deliveryPersonId
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse>{
   
    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(user)
  
    return right({})
  }
}
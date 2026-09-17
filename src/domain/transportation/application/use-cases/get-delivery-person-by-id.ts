import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository.js'
import { Either, left, right } from '#src/core/either.js'
import { User } from '../../enterprise/entities/user.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'


interface GetDeliveryPersonUseCaseRequest {
   deliveryPersonId: string
} 

type GetDeliveryPersonUseCaseResponse = Either <
ResourceNotFoundError,
{
   deliveryPerson: User
}>

@Injectable()
export class GetDeliveryPersonUseCase {
  constructor (
        private usersRepository: UsersRepository
  ){}

  async execute({
    deliveryPersonId
  }: GetDeliveryPersonUseCaseRequest): Promise<GetDeliveryPersonUseCaseResponse>{
    const deliveryPerson = await this.usersRepository.findById(deliveryPersonId)

    if(!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }
  
    return right({
      deliveryPerson,
    })
  }
}
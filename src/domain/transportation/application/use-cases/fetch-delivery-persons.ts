import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository.js'
import { Either, right } from '#src/core/either.js'
import { User } from '../../enterprise/entities/user.js'


interface FetchDeliveryPersonsUseCaseRequest {
    page: number,
} 

type FetchDeliveryPersonsUseCaseResponse = Either <
null,
{
   users: User[]
}>

@Injectable()
export class FetchDeliveryPersonsUseCase {
  constructor (
        private usersRepository: UsersRepository
  ){}

  async execute({
    page
  }: FetchDeliveryPersonsUseCaseRequest): Promise<FetchDeliveryPersonsUseCaseResponse>{
    const users = await this.usersRepository.findManyByRole({page}, 'DELIVERY_PERSON')
  
    return right({
      users,
    })
  }
}
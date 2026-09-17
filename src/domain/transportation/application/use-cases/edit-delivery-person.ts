import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository.js'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'


interface EditDeliveryPersonUseCaseRequest {
    deliveryPersonId: string
    name?: string
    email?: string
} 

type EditDeliveryPersonUseCaseResponse = Either <
ResourceNotFoundError | UserAlreadyExistsError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class EditDeliveryPersonUseCase {
  constructor (
        private usersRepository: UsersRepository
  ){}

  async execute({
    name,
    email,
    deliveryPersonId
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse>{
    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if (email !== undefined) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail && !userWithSameEmail.id.equals(user.id)) {
        return left(new UserAlreadyExistsError(userWithSameEmail.email))
      }
    }

    if (name !== undefined) {
      user.name = name
    }

    if (email !== undefined) {
      user.email = email
    }
   
    await this.usersRepository.save(user)
  
    return right({})
  }
}
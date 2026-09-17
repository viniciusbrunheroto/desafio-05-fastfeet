import { Either, left, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { HashGenerator } from '../cryptography/hash-generator.js'


interface ChangePasswordUseCaseRequest {
    userId: string
    newPassword: string
}

type AuthenticateStudentUseCaseResponse = Either<
ResourceNotFoundError,  
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {}
>

@Injectable()
export class ChangePasswordUseCase {
  constructor (
         private usersRepository: UsersRepository,
         private hashGenerator: HashGenerator
  ) {}
 
  async execute({
    userId,
    newPassword
  }: ChangePasswordUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {

    const user = await this.usersRepository.findById(userId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    user.changePassword(hashedPassword)

    await this.usersRepository.save(user)
   
    return right({})
  }
} 
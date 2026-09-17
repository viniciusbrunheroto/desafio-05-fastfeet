import { Either, left, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { User, UserRole } from '../../enterprise/entities/user.js'
import { CPF } from '../../enterprise/entities/value-objects/cpf.js'
import { HashGenerator } from '../cryptography/hash-generator.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

interface RegisterUserUseCaseRequest {
    name: string
    password: string
    cpf: string
    email: string
    role?: UserRole
}

type RegisterUserUseCaseResponse = Either<
UserAlreadyExistsError,  
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
        private usersRepository: UsersRepository,
        private hashGenerator: HashGenerator
  ) {}


  async execute({
    name,
    email,
    password,
    cpf,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
   
    const userWithSameCpf = await this.usersRepository.findByCpf(cpf)
  
    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(userWithSameCpf.cpf))
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(userWithSameEmail.email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      cpf: CPF.create(cpf),
      role : role ?? UserRole.DELIVERY_PERSON
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })

  }

}
import { Either, left, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../cryptography/encrypter.js'
import { HashComparer } from '../cryptography/hash-comparer.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { WrongCredentialsError } from './errors/wrong-credentials-error.js'


interface AuthenticateUserUseCaseRequest {
    cpf: string
    password: string
}

type AuthenticateStudentUseCaseResponse = Either<
WrongCredentialsError,  
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor (
         private usersRepository: UsersRepository,
         private hashComparer: HashComparer,
         private encrypter: Encrypter
  ) {}
 
  async execute({
    cpf,
    password
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {

    const user = await this.usersRepository.findByCpf(cpf)

    if(!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(password, user.password)

    if(!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(), 
        role: user.role
      }
    )

    return right({
      accessToken
    })
  }
} 
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { UserRole } from '../../enterprise/entities/user.js'
import { RegisterUserUseCase } from './register-user.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
  })


  it('should be able to register a new user', async () => {

    const result = await sut.execute({
      name: 'João Silva',
      password: 'Senha@123',
      cpf: '529.982.247-25',
      email: 'joao.silva@email.com',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    })

    expect(result.value).toEqual({
      user: expect.objectContaining({
        role: UserRole.DELIVERY_PERSON
      })
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'João Silva',
      password: 'Senha@123',
      cpf: '529.982.247-25',
      email: 'joao.silva@email.com',
    })

    const hashedPassword = await fakeHasher.hash('Senha@123')

    expect(result.isRight()).toBe(true)

    expect(inMemoryUsersRepository.users[0].password).toEqual(hashedPassword)
  })
})
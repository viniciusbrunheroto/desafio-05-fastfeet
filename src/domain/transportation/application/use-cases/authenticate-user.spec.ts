import { makeUser } from '../../../../../test/factories/make-user.js'
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter.js'
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { AuthenticateUserUseCase } from './authenticate-user.js'
import { CPF } from '../../enterprise/entities/value-objects/cpf.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
  })


  it('should be able to register a new user', async () => {

    const user = makeUser({
      cpf: CPF.create('529.982.247-25'),
      password: await fakeHasher.hash('123456')
    })

    inMemoryUsersRepository.users.push(user)

    const result = await sut.execute({
      cpf: '52998224725',
      password: '123456'
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

})
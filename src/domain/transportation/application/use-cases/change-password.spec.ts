import { makeUser } from '../../../../../test/factories/make-user.js'
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'

import { ChangePasswordUseCase } from './change-password.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: ChangePasswordUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangePasswordUseCase(inMemoryUsersRepository, fakeHasher)
  })


  it('should be able to change password', async () => {

    const user = makeUser({
      password: await fakeHasher.hash('old-password')
    })

    inMemoryUsersRepository.users.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      newPassword: 'new-password'
    })

    expect(result.isRight()).toBe(true)

    expect(await fakeHasher.compare('new-password', user.password)).toBe(true)
    expect(await fakeHasher.compare('old-password', user.password)).toBe(false)

  })

  it('should not change password if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
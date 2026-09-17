import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { UserRole } from '../../enterprise/entities/user.js'
import { FetchDeliveryPersonsUseCase } from './fetch-delivery-persons.js'


let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchDeliveryPersonsUseCase

describe('Fetch Delivery Persons', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new FetchDeliveryPersonsUseCase(inMemoryUsersRepository)
  })


  it('should be able to fetch delivery persons', async () => {
    await inMemoryUsersRepository.create(makeUser())
    await inMemoryUsersRepository.create(makeUser({ role: UserRole.ADMIN}))
    await inMemoryUsersRepository.create(makeUser())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.users).toHaveLength(2)
  })

  it('should be able to fetch paginated delivery person', async() => {

    for (let i = 1; i <= 22; i++ ) {
      await inMemoryUsersRepository.create(makeUser())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.users).toHaveLength(2)
    
  })
}) 

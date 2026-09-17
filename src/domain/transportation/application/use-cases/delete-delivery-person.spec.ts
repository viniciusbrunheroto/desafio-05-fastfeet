import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person.js'


let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteDeliveryPersonUseCase

describe('Delete Delivery Person', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteDeliveryPersonUseCase(inMemoryUsersRepository)
  })


  it('should be able to delete a delivery person', async () => {
  
    const newUser = makeUser({}, new UniqueEntityID('user-1'))

    await inMemoryUsersRepository.create(newUser)

    await sut.execute({
      deliveryPersonId: 'user-1',
    })

    expect(inMemoryUsersRepository.users).toHaveLength(0)
  })
}) 

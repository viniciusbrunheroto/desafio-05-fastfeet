import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { EditDeliveryPersonUseCase } from './edit-delivery-person.js'


let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditDeliveryPersonUseCase

describe('Edit Delivery Person', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditDeliveryPersonUseCase(inMemoryUsersRepository)
  })


  it('should be able to edit delivery person', async () => {
  
    const newUser = makeUser()

    await inMemoryUsersRepository.create(newUser)

    await sut.execute({
      deliveryPersonId: newUser.id.toString(),
      name: 'Novo nome',
      email: 'novoemail@email.com',
    })

    expect(inMemoryUsersRepository.users[0]).toMatchObject({
      name: 'Novo nome',
      email: 'novoemail@email.com'
    })
  })
}) 

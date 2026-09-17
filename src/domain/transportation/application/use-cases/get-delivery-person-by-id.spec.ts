import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { GetDeliveryPersonUseCase } from './get-delivery-person-by-id.js'


let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetDeliveryPersonUseCase

describe('Get Delivery Person By Id', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetDeliveryPersonUseCase(inMemoryUsersRepository)
  })


  it('should be able to get delivery person by id', async () => {
    const deliveryPerson = makeUser({ name: 'John Doe'})

    inMemoryUsersRepository.users.push(deliveryPerson)
  
    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.value).toMatchObject({
      deliveryPerson: expect.objectContaining({
        name: 'John Doe'
      })
    })
  })

}) 

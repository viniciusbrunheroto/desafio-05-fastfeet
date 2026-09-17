import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { FetchDeliveryPersonOrdersUseCase } from './fetch-delivery-person-orders.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchDeliveryPersonOrdersUseCase

describe('Fetch Delivery Person Orders', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new FetchDeliveryPersonOrdersUseCase(inMemoryOrdersRepository)
  })


  it('should be able to fetch delivery person orders', async () => {

    const recipient = makeRecipient()
   
    await inMemoryRecipientsRepository.create(makeRecipient())

    const order1 = makeOrder({
      recipientId: recipient.id,
    })
    
    const order2 = makeOrder({
      recipientId: recipient.id,
    })

    const order3 = makeOrder({
      recipientId: recipient.id,
    })


    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)
  
    const deliveryPerson = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson)

    inMemoryOrdersRepository.orders[0].pending()

    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)

    inMemoryOrdersRepository.orders[1].pending()

    inMemoryOrdersRepository.orders[1].pickup(deliveryPerson.id)

    inMemoryOrdersRepository.orders[2].pending()

    inMemoryOrdersRepository.orders[2].pickup(deliveryPerson.id)

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()){
      expect(result.value?.orders).toHaveLength(3)
    }
    
  })

  it('should not be able to fetch delivery person orders from another delivery person', async() => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(makeRecipient())

    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
    }))

    const deliveryPerson = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson)

    inMemoryOrdersRepository.orders[0].pending()

    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)

    const result = await sut.execute({
      deliveryPersonId: 'another-delivery-person-id',
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()){
      expect(result.value?.orders).toHaveLength(0)
    }
  })
}) 

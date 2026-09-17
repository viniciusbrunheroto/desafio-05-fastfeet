import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository)
  })


  it('should be able to fetch nearby orders', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(makeRecipient())

    const order1 = makeOrder({
      recipientId: recipient.id,
      deliveryLatitude: -22.7422412,
      deliveryLongitude: -47.6352641,
    })

    await inMemoryOrdersRepository.create(order1)

    const order2 = makeOrder({
      recipientId: recipient.id,
      deliveryLatitude: -22.5418212,
      deliveryLongitude: -47.9231322,
    })

    await inMemoryOrdersRepository.create(order2)
   
    const result = await sut.execute({
      userLatitude: -22.7422412,
      userLongitude: -47.6352641,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders).toEqual([
      expect.objectContaining({
        _id: order1.id
      })
    ])
  })
}) 

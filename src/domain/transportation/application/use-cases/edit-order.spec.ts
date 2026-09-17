import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { EditOrderUseCase } from './edit-order.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: EditOrderUseCase

describe('Edit Order', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new EditOrderUseCase(inMemoryOrdersRepository)
  })


  it('should be able to edit order', async () => {
  
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const newOrder = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      deliveryLatitude: -22.7253,
      deliveryLongitude: -47.6492,
    })


    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining ({
        deliveryLatitude: -22.7253,
        deliveryLongitude: -47.6492,
      }))
  })
}) 

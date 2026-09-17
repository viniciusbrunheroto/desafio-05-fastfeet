import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { DeleteOrderUseCase } from './delete-order.js'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteOrderUseCase

describe('Delete Delivery Person', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })


  it('should be able to delete order', async () => {
  
    const newRecipient = makeRecipient()

    await inMemoryRecipientsRepository.create(newRecipient)

    const newOrder = makeOrder({
      recipientId: newRecipient.id
    })

    await inMemoryOrdersRepository.create(newOrder)

    await sut.execute({
      orderId: newOrder.id.toString(),
    })

    expect(inMemoryOrdersRepository.orders).toHaveLength(0)
  })
}) 

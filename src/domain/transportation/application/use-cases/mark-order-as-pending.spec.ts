import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { MarkOrderAsPendingUseCase } from './mark-order-as-pending.js'
import { OrderStatus } from '../../enterprise/entities/order.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsPendingUseCase

describe('Fetch orders by status', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new MarkOrderAsPendingUseCase(inMemoryOrdersRepository)
  })


  it('should be able to mark order as pending', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining({
        status: OrderStatus.PENDING
      })
    )
    
  })
}) 

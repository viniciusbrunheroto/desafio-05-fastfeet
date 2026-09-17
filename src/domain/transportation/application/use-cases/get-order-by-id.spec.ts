import { makeOrder } from '../../../../../test/factories/make-order.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { GetOrderByIdUseCase } from './get-order-by-id.js'
import { OrderStatus } from '../../enterprise/entities/order.js'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })


  it('should be able to get order by id', async () => {
    const recipient = makeRecipient({ name: 'Diego Fernandes'})

    inMemoryRecipientsRepository.recipients.push(recipient)

    const newOrder = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
    })

    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        status: OrderStatus.CREATED,
      })
    })
  })

}) 

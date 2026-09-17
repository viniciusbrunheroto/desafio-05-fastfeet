import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { CreateOrderUseCase } from './create-order.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a new order', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)
  
    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      deliveryLatitude: -22.7253,
      deliveryLongitude: -47.6492,
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.orders[0]
    })

    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })
})


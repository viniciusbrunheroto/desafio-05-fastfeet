import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { FetchOrdersUseCase } from './fetch-orders.js'
import { OrderStatus } from '../../enterprise/entities/order.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })


  it('should be able to fetch orders', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(makeRecipient())

    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
    }))


    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
  })

  it('should be able to fetch paginated delivery person', async() => {

    for (let i = 1; i <= 22; i++ ) {
      await inMemoryOrdersRepository.create(makeOrder())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(2)
    
  })

  it('should be able to fetch orders by status', async () => {
  
    const recipient = makeRecipient()
  
    await inMemoryRecipientsRepository.create(recipient)
  
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
      status: OrderStatus.PENDING,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
      status: OrderStatus.PICKED_UP,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient.id,
      status: OrderStatus.DELIVERED,
    }))
  
  
    const result = await sut.execute({
      page: 1,
      status: 'pending'
    })
  
    expect(result.isRight()).toBe(true)
  
    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(2)
    }
      
  })

  it('should be able to fetch orders by neighborhood', async () => {
  
    const recipient1 = makeRecipient({
      neighborhood: 'Jardim das Acácias'
    })
  
    await inMemoryRecipientsRepository.create(recipient1)
  
    const recipient2 = makeRecipient({
      neighborhood: 'Jardim Europa'
    })
  
    await inMemoryRecipientsRepository.create(recipient2)
  
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient1.id,
      status: OrderStatus.PENDING,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient2.id,
      status: OrderStatus.PICKED_UP,
    }))
    await inMemoryOrdersRepository.create(makeOrder({
      recipientId: recipient2.id,
      status: OrderStatus.DELIVERED,
    }))
  
  
    const result = await sut.execute({
      page: 1,
      neighborhood: 'Jardim Europa'
    })
  
    expect(result.isRight()).toBe(true)
  
    if(result.isRight()) {
      expect(result.value.orders).toHaveLength(2)
      expect(result.value.orders[0]).toEqual(
        expect.objectContaining({
          recipientId: recipient2.id
        })
      )
    }
  })
}) 

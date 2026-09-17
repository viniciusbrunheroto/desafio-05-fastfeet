import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { OrderStatus } from '../../enterprise/entities/order.js'
import { MarkOrderAsReturnedUseCase } from './mark-order-as-returned.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { makeUser } from '../../../../../test/factories/make-user.js'

let inMemoryUsersRepository : InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsReturnedUseCase

describe('Mark order as returned', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new MarkOrderAsReturnedUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
  })


  it('should be able to mark order as returned', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeUser()
    
    await inMemoryUsersRepository.create(deliveryPerson)
        

    inMemoryOrdersRepository.orders[0].pending()

    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining({
        status: OrderStatus.RETURNED
      })
    )
    
  })
}) 

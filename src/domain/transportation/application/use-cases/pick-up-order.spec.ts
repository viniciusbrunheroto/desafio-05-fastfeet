import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { OrderStatus } from '../../enterprise/entities/order.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { PickUpOrderUseCase } from './pick-up-order.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: PickUpOrderUseCase

describe('Pick-up order', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new PickUpOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
  })


  it('should be able to pick-up an order', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    inMemoryOrdersRepository.orders[0].pending()

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: user.id.toString(),
    })


    expect(result.isRight()).toBe(true)

    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining({
        status: OrderStatus.PICKED_UP,
        deliveryPersonId: user.id,
      })
    )
  })
}) 

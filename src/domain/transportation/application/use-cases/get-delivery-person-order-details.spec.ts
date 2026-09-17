import { makeOrder } from '../../../../../test/factories/make-order.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { OrderStatus } from '../../enterprise/entities/order.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { UserRole } from '../../enterprise/entities/user.js'
import { GetDeliveryPersonOrderDetailsUseCase } from './get-delivery-person-order-details.js'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetDeliveryPersonOrderDetailsUseCase

describe('Get Delivery Person Order By Id', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new GetDeliveryPersonOrderDetailsUseCase(inMemoryOrdersRepository)
  })


  it('should be able to get a delivery person order by id', async () => {

    const user = makeUser({
      role: UserRole.DELIVERY_PERSON
    })

    inMemoryUsersRepository.users.push(user)

    const recipient = makeRecipient({ name: 'Diego Fernandes'})

    inMemoryRecipientsRepository.recipients.push(recipient)

    const newOrder = makeOrder({
      recipientId: recipient.id,
      deliveryPersonId: user.id,
    })

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      deliveryPersonId: user.id.toString()
    })

    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        status: OrderStatus.CREATED,
      })
    })
  })
}) 

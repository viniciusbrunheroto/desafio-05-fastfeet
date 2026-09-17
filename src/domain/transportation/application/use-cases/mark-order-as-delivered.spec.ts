import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { OrderStatus } from '../../enterprise/entities/order.js'
import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { InMemoryFileAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository.js'
import { makeFileAttachment } from '../../../../../test/factories/make-attachment.js'

let inMemoryFileAttachmentsRepository: InMemoryFileAttachmentsRepository
let inMemoryUsersRepository : InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsDeliveredUseCase

describe('Mark an order as delivered', () => {

  beforeEach(() => {
    inMemoryFileAttachmentsRepository = new InMemoryFileAttachmentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new MarkOrderAsDeliveredUseCase(inMemoryFileAttachmentsRepository, inMemoryOrdersRepository, inMemoryUsersRepository)
  })


  it('should be able to mark an order as delivered', async () => {

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

    const file = makeFileAttachment({
      orderId: order.id
    })

    inMemoryFileAttachmentsRepository.create(file)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      photoId: file.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining({
        deliveryDate: expect.any(Date)
      })
    )
    expect(inMemoryOrdersRepository.orders[0]).toEqual(
      expect.objectContaining({
        status: OrderStatus.DELIVERED
      })
    )
    
  })

  it('should not mark an order as delivered if the order does not exist', async () => {

    const deliveryPerson = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson)

    const result = await sut.execute({
      orderId: 'non-existing-order-id',
      deliveryPersonId: deliveryPerson.id.toString(),
      photoId: 'some-photo.png'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not allow another delivery person to deliver the order', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    const deliveryPerson1 = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson1)


    inMemoryOrdersRepository.orders[0].pending()
    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson1.id)


    const deliveryPerson2 = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson2)


    const file = makeFileAttachment({
      orderId: order.id
    })

    inMemoryFileAttachmentsRepository.create(file)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson2.id.toString(),
      photoId: file.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    
  })
}) 

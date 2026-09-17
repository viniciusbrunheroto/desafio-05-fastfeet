import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { makeUser } from '../../../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { FetchDeliveredByDeliveryPersonUseCase } from './fetch-delivered-by-delivery-person-id.js'
import { makeFileAttachment } from '../../../../../test/factories/make-attachment.js'
import { InMemoryFileAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryFileAttachmentsRepository: InMemoryFileAttachmentsRepository
let sut: FetchDeliveredByDeliveryPersonUseCase

describe('Fetch Delivery Person Orders', () => {

  beforeEach(() => {
    inMemoryFileAttachmentsRepository = new InMemoryFileAttachmentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    sut = new FetchDeliveredByDeliveryPersonUseCase(inMemoryOrdersRepository)
  })


  it('should be able to fetch orders delivered by delivery person id', async () => {

    const recipient = makeRecipient()
   
    await inMemoryRecipientsRepository.create(makeRecipient())

    const order1 = makeOrder({
      recipientId: recipient.id,
    })
    
    const order2 = makeOrder({
      recipientId: recipient.id,
    })

    const order3 = makeOrder({
      recipientId: recipient.id,
    })


    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)
  
    const deliveryPerson = makeUser()

    await inMemoryUsersRepository.create(deliveryPerson)

    inMemoryOrdersRepository.orders[0].pending()

    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)

    const attachment = makeFileAttachment()

    await inMemoryFileAttachmentsRepository.create(attachment)

    inMemoryOrdersRepository.orders[0].deliver(attachment)

    inMemoryOrdersRepository.orders[1].pending()

    inMemoryOrdersRepository.orders[1].pickup(deliveryPerson.id)

    inMemoryOrdersRepository.orders[2].pending()

    inMemoryOrdersRepository.orders[2].pickup(deliveryPerson.id)

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString()
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()){
      expect(result.value?.orders).toHaveLength(1)
    }
  })
}) 

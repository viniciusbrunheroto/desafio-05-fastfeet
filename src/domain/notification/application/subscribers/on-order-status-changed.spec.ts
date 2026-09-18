import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { MockInstance } from 'vitest'
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from '../use-cases/send-notification.js'
import { OnOrderStatusChangedEvent } from './on-order-status-changed.js'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository.js'
import { waitFor } from '../../../../../test/utils/wait-for.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
({
  ...args
}: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Status Changed', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderStatusChangedEvent(inMemoryOrdersRepository, sendNotificationUseCase)
  })


  it('should send a notification when status change to pending', async () => {

    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    order.pending()

    await inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
}) 

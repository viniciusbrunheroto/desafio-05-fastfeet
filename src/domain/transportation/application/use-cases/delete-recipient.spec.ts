import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { DeleteRecipientUseCase } from './delete-recipient.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete Delivery Person', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })


  it('should be able to delete a delivery person', async () => {
  
    const newRecipient = makeRecipient({}, new UniqueEntityID('user-1'))

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: 'user-1',
    })

    expect(inMemoryRecipientsRepository.recipients).toHaveLength(0)
  })
}) 

import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { GetRecipientByIdUseCase } from './get-recipient-by-id.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientByIdUseCase

describe('Get Delivery Person By Id', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientByIdUseCase(inMemoryRecipientsRepository)
  })


  it('should be able to get recipient by id', async () => {
    const recipient = makeRecipient({ name: 'Diego Fernandes'})

    inMemoryRecipientsRepository.recipients.push(recipient)
  
    const result = await sut.execute({
      recipientId: recipient.id.toString()
    })

    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        name: 'Diego Fernandes'
      })
    })
  })

}) 

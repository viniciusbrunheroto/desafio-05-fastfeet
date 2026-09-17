import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { FetchRecipientsUseCase } from './fetch-recipients.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Delivery Persons', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })


  it('should be able to fetch recipients', async () => {
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.recipients).toHaveLength(3)
  })

  it('should be able to fetch paginated delivery person', async() => {

    for (let i = 1; i <= 22; i++ ) {
      await inMemoryRecipientsRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.recipients).toHaveLength(2)
    
  })
}) 

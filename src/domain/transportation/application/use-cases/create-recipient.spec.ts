import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { CreateRecipientUseCase } from './create-recipient.js'



let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a new recipient', async () => {
  
    const result = await sut.execute({
      name: 'João Silva',
      street: 'Rua das Flores',
      neighborhood: 'Centro',
      city: 'Piracicaba',
      state: 'SP',
      cep: '13400-000',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.recipients[0]
    })

    expect(result.value?.recipient).toEqual(
      expect.objectContaining({
        name: 'João Silva'
      })
    )
  })
})


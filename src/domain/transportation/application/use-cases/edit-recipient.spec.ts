import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { EditRecipientUseCase } from './edit-recipient.js'
import { makeRecipient } from '../../../../../test/factories/make-recipient.js'
import { CEP } from '../../enterprise/entities/value-objects/cep.js'


let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })


  it('should be able to edit recipient', async () => {
  
    const newRecipient = makeRecipient()

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: newRecipient.id.toString(),
      name: 'Novo nome',
      street: 'Nova rua',
      neighborhood: 'Bairro Novo',
      city: 'Cidade Nova',
      state: 'Estado Novo',
      cep: '13400-000',
    })

    expect(inMemoryRecipientsRepository.recipients[0]).toMatchObject({
      name: 'Novo nome',
      street: 'Nova rua',
      neighborhood: 'Bairro Novo',
      city: 'Cidade Nova',
      state: 'Estado Novo',
      cep: CEP.create('13400-000'),
    })
  })
}) 

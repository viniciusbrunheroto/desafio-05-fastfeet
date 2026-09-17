import { InMemoryOrdersRepository } from '../../../../../test/repositories/in-memory-orders-repository.js'
import { InMemoryFileAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository.js'
import { FakeUploader } from '../../../../../test/storage/fake-uploader.js'
import { InvalidFileTypeError } from './errors/invalid-file-type-error.js'
import { UploadAndCreateDeliveryPhotoUseCase } from './upload-and-create-delivery-photo.js'
import { InMemoryRecipientsRepository } from '../../../../../test/repositories/in-memory-recipients-repository.js'
import { makeOrder } from '../../../../../test/factories/make-order.js'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository.js'
import { makeUser } from '../../../../../test/factories/make-user.js'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository : InMemoryOrdersRepository
let inMemoryFileAttachmentsRepository: InMemoryFileAttachmentsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateDeliveryPhotoUseCase


describe('Upload and create photo', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
    inMemoryFileAttachmentsRepository = new InMemoryFileAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateDeliveryPhotoUseCase(inMemoryUsersRepository, inMemoryOrdersRepository, inMemoryFileAttachmentsRepository, fakeUploader)
  })


  it('should be able to upload and create an file attachment', async () => {

    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeUser()
        
    await inMemoryUsersRepository.create(deliveryPerson)

    inMemoryOrdersRepository.orders[0].pending()
    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      fileCreated: inMemoryFileAttachmentsRepository.fileAttachments[0]
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(expect.objectContaining({
      fileName: 'profile.png',
    }))
  })

  it('should not be able to upload an file attachment with invalid file type', async () => {

    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeUser()
        
    await inMemoryUsersRepository.create(deliveryPerson)

    inMemoryOrdersRepository.orders[0].pending()
    inMemoryOrdersRepository.orders[0].pickup(deliveryPerson.id)
    
    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFileTypeError)
  })
})
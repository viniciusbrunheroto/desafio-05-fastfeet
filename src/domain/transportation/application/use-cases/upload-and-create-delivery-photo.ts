import { Either, left, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment.js'
import { InvalidFileTypeError } from './errors/invalid-file-type-error.js'
import { AttachmentsRepository } from '../repositories/attachments-repository.js'
import { Uploader } from '../storage/uploader.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { OrderStatus } from '../../enterprise/entities/order.js'


interface UploadAndCreateDeliveryPhotoUseCaseRequest {
    orderId: string
    deliveryPersonId: string
    fileName: string
    fileType: string
    body: Buffer
}


type UploadAndCreateDeliveryPhotoUseCaseResponse = Either<
InvalidFileTypeError | ResourceNotFoundError,
{
    fileCreated: Attachment
}>

@Injectable()
export class UploadAndCreateDeliveryPhotoUseCase {
  constructor(
        private usersRepository: UsersRepository,
        private ordersRepository: OrdersRepository,
        private attachmentsRepository: AttachmentsRepository,
        private uploader: Uploader
  ){}

  async execute({
    fileName,
    fileType,
    body,
    orderId,
    deliveryPersonId
  }: UploadAndCreateDeliveryPhotoUseCaseRequest): Promise<UploadAndCreateDeliveryPhotoUseCaseResponse> {

    
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    if(order.status !== OrderStatus.PICKED_UP) {
      return left(new NotAllowedError())
    }

    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(order.deliveryPersonId?.toString() !== deliveryPersonId) {
      return left(new NotAllowedError())
    }

    if (!/^image\/(jpeg|png)$/.test(fileType)) {
      return left(new InvalidFileTypeError(fileType))
    }

    const { url} = await this.uploader.upload({
      fileName,
      fileType,
      body
    })

    const fileAttachment = Attachment.create({
      orderId: new UniqueEntityID(orderId),
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(fileAttachment)

    return right({
      fileCreated: fileAttachment,
    })
  }
}
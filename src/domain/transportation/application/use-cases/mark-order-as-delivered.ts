import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'
import { AttachmentsRepository } from '../repositories/attachments-repository.js'
import { OrderStatus } from '../../enterprise/entities/order.js'



interface MarkOrderAsDeliveredUseCaseRequest {
    orderId: string,
    deliveryPersonId: string,
    photoId: string,
} 

type MarkOrderAsDeliveredUseCaseResponse = Either <
ResourceNotFoundError | NotAllowedError,
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor (
    private fileAttachmentsRepository: AttachmentsRepository,
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository
  ){}

  async execute({
    orderId,
    deliveryPersonId,
    photoId
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(!order.deliveryPersonId) {
      return left(new NotAllowedError())
    }

    if(order.deliveryPersonId.toString() !== deliveryPersonId) {
      return left(new NotAllowedError())
    }

    const photo = await this.fileAttachmentsRepository.findById(photoId)

    if(!photo) {
      return left(new ResourceNotFoundError())
    }

    if (photo.orderId.toString() !== order.id.toString()){
      return left(new NotAllowedError())
    }

    if(order.status !== OrderStatus.PICKED_UP) {
      return left(new NotAllowedError())
    }

    order.deliver(photo)
     
    await this.ordersRepository.save(order)
  
    return right({})
  }
}
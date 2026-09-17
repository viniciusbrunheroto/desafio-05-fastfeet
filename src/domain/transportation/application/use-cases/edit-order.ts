import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'


interface EditOrderUseCaseRequest {
    orderId: string,
    deliveryPersonId?: string | null,
    recipientId?: string
    deliveryLatitude?: number
    deliveryLongitude?: number
} 

type EditOrderUseCaseResponse = Either <
InvalidOrderStatusError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class EditOrderUseCase {
  constructor (
    private ordersRepository: OrdersRepository
  ){}

  async execute({
    orderId,
    deliveryPersonId,
    recipientId,
    deliveryLatitude,
    deliveryLongitude
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    if(deliveryPersonId !== undefined) {
      order.deliveryPersonId = deliveryPersonId
        ? new UniqueEntityID(deliveryPersonId)
        : null
    }

    if (recipientId !== undefined) {
      order.recipientId = new UniqueEntityID(recipientId)
    }

    if (deliveryLatitude !== undefined) {
      order.deliveryLatitude = deliveryLatitude
    }

    if (deliveryLongitude !== undefined){
      order.deliveryLongitude = deliveryLongitude
    }
     
    await this.ordersRepository.save(order)
  
    return right({})
  }
}
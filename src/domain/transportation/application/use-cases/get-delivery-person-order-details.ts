import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'


interface GetDeliveryPersonOrderDetailsUseCaseRequest {
   orderId: string
   deliveryPersonId: string
} 

type GetDeliveryPersonOrderDetailsUseCaseResponse = Either <
ResourceNotFoundError,
{
   order: Order
}>

@Injectable()
export class GetDeliveryPersonOrderDetailsUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    orderId,
    deliveryPersonId
  }: GetDeliveryPersonOrderDetailsUseCaseRequest): Promise<GetDeliveryPersonOrderDetailsUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    if(order.deliveryPersonId?.toString() !== deliveryPersonId) {
      return left(new NotAllowedError())
    }
  
    return right({
      order,
    })
  }
}
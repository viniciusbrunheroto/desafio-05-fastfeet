import { Injectable } from '@nestjs/common'
import { Either, right } from '#src/core/either.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'


interface FetchDeliveredByDeliveryPersonUseCaseRequest {
    deliveryPersonId: string
} 

type FetchDeliveredByDeliveryPersonUseCaseResponse = Either <
null,
{
   orders: Order[]
}>

@Injectable()
export class FetchDeliveredByDeliveryPersonUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    deliveryPersonId
  }: FetchDeliveredByDeliveryPersonUseCaseRequest): Promise<FetchDeliveredByDeliveryPersonUseCaseResponse>{
    const orders = await this.ordersRepository.findManyDeliveredByDeliveryPersonId(deliveryPersonId)
  
    return right({
      orders,
    })
  }
}
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'


interface FetchDeliveryPersonOrdersUseCaseRequest {
    deliveryPersonId: string,
    page: number,
    status?: 'pending' | 'delivered',
    neighborhood?: string,
} 

type FetchDeliveryPersonOrdersUseCaseResponse = Either <
ResourceNotFoundError,
{
   orders: Order[]
}>

@Injectable()
export class FetchDeliveryPersonOrdersUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    deliveryPersonId,
    page,
    neighborhood,
    status
  }: FetchDeliveryPersonOrdersUseCaseRequest): Promise<FetchDeliveryPersonOrdersUseCaseResponse>{
    const orders = await this.ordersRepository.findManyByDeliveryPersonId(deliveryPersonId,
      {page, neighborhood, status}
    )
    
    if(!orders) {
      return left(new ResourceNotFoundError())
    }
    
    return right({
      orders,
    })
  }
}
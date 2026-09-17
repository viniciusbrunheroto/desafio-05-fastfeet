import { Injectable } from '@nestjs/common'
import { Either, right } from '#src/core/either.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'


interface FetchNearbyOrdersUseCaseRequest {
    userLatitude: number
    userLongitude: number
} 

type FetchNearbyOrdersUseCaseResponse = Either <
null,
{
   orders: Order[]
}>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    userLatitude,
    userLongitude
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse>{
    
    const orders = await this.ordersRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return right({
      orders,
    })
  }
}
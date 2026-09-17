import { Injectable } from '@nestjs/common'
import { Either, right } from '#src/core/either.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'


interface FetchOrdersUseCaseRequest {
    page: number,
    status?: 'pending' | 'delivered',
    neighborhood?: string,
} 

type FetchOrdersUseCaseResponse = Either <
null,
{
   orders: Order[]
}>

@Injectable()
export class FetchOrdersUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    page,
    status,
    neighborhood,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse>{
    const orders = await this.ordersRepository.findMany({
      page, 
      status, 
      neighborhood})
  
    return right({
      orders,
    })
  }
}
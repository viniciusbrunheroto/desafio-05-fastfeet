import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { Order } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'


interface GetOrderByIdUseCaseRequest {
   orderId: string
} 

type GetOrderByIdUseCaseResponse = Either <
ResourceNotFoundError,
{
   order: Order
}>

@Injectable()
export class GetOrderByIdUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    orderId
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }
  
    return right({
      order,
    })
  }
}
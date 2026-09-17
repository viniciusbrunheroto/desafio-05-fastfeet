import { Either, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { Order, OrderStatus } from '../../enterprise/entities/order.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'

interface CreateOrderUseCaseRequest {
    recipientId: string,
    deliveryLatitude: number,
    deliveryLongitude: number,
}

type CreateOrderUseCaseResponse = Either<
null,  
  { 
    order: Order
  }
> 

@Injectable()
export class CreateOrderUseCase {
  constructor(
        private ordersRepository: OrdersRepository,
  ) {}


  async execute({
    recipientId,
    deliveryLatitude,
    deliveryLongitude
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
   
   
    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
      deliveryLatitude,
      deliveryLongitude,
      status: OrderStatus.CREATED 
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
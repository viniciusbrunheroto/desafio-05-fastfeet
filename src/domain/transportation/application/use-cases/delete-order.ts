import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'


interface DeleteOrderUseCaseRequest {
    orderId: string
} 

type DeleteOrderUseCaseResponse = Either <
ResourceNotFoundError,
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class DeleteOrderUseCase {
  constructor (
        private ordersRepository: OrdersRepository
  ){}

  async execute({
    orderId
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse>{
   
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    await this.ordersRepository.delete(order)
  
    return right({})
  }
}
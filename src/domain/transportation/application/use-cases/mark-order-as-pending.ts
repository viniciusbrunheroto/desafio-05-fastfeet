import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'
import { OrderStatus } from '../../enterprise/entities/order.js'


interface MarkOrderAsPendingUseCaseRequest {
    orderId: string,
} 

type MarkOrderAsPendingUseCaseResponse = Either <
ResourceNotFoundError | NotAllowedError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class MarkOrderAsPendingUseCase {
  constructor (
    private ordersRepository: OrdersRepository
  ){}

  async execute({
    orderId,
  }: MarkOrderAsPendingUseCaseRequest): Promise<MarkOrderAsPendingUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    if(order.status !== OrderStatus.CREATED){ 
      return left(new NotAllowedError())
    }

    order.pending()
     
    await this.ordersRepository.save(order)
  
    return right({})
  }
}
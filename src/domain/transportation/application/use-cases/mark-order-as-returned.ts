import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { OrderStatus } from '../../enterprise/entities/order.js'


interface MarkOrderAsReturnedUseCaseRequest {
  deliveryPersonId: string,
  orderId: string,
} 

type MarkOrderAsReturnedUseCaseResponse = Either <
NotAllowedError | ResourceNotFoundError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor (
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository
  ){}

  async execute({
    orderId,
    deliveryPersonId
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(order.deliveryPersonId?.toString() !== deliveryPersonId) {
      return left(new NotAllowedError())
    }

    if(order.status !== OrderStatus.PICKED_UP) {
      return left(new NotAllowedError())
    }

    order.return()
     
    await this.ordersRepository.save(order)
  
    return right({})
  }
}
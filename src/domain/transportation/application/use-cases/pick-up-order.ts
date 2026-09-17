import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#src/core/either.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { OrdersRepository } from '../repositories/orders-repository.js'
import { UsersRepository } from '../repositories/users-repository.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { OrderStatus } from '../../enterprise/entities/order.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'


interface PickUpOrderUseCaseRequest {
    orderId: string,
    deliveryPersonId: string
} 

type PickUpOrderUseCaseResponse = Either <
ResourceNotFoundError | NotAllowedError,  
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
{}>

@Injectable()
export class PickUpOrderUseCase {
  constructor (
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository
  ){}

  async execute({
    orderId,
    deliveryPersonId
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse>{
    const order = await this.ordersRepository.findById(orderId)

    if(!order) {
      return left(new ResourceNotFoundError())
    }

    const user = await this.usersRepository.findById(deliveryPersonId)

    if(!user) {
      return left(new ResourceNotFoundError())
    }

    if(order.status !== OrderStatus.PENDING) {
      return left(new NotAllowedError())
    }
    
    order.pickup(new UniqueEntityID(deliveryPersonId))
     
    await this.ordersRepository.save(order)
  
    return right({})
  }
}
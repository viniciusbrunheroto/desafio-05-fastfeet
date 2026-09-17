import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Order, OrderProps, OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { PrismaOrdersMapper } from '#src/infra/database/prisma/mappers/prisma-orders-mapper.js'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID
) {
  const order = Order.create({
    recipientId: new UniqueEntityID(),
    status: OrderStatus.CREATED,
    deliveryLatitude: faker.location.latitude(),
    deliveryLongitude: faker.location.longitude(),
    ...override,
  }, id)

  return order
}


@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrdersMapper.toPrisma(order)
    })

    return order
  }
}
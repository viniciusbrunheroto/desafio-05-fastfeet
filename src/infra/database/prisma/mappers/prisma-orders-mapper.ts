import { UniqueEntityID } from '../../../../core/entities/unique-entity-id.js'
import { Order as PrismaOrder, Prisma } from '#src/generated/prisma/client.js'
import { Order, OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'


export class PrismaOrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create({
      recipientId: new UniqueEntityID(raw.recipientId),
      deliveryPersonId: raw.deliveryPersonId 
        ? new UniqueEntityID(raw.deliveryPersonId)
        : null,
      deliveryLatitude: Number(raw.deliveryLatitude),
      deliveryLongitude: Number(raw.deliveryLongitude),
      status: OrderStatus[raw.status],
      deliveryDate: raw.deliveryDate,
      pickupDate: raw.pickupDate,
      returnedDate: raw.returnedDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryPersonId: order.deliveryPersonId?.toString(),
      deliveryLatitude: new Prisma.Decimal(order.deliveryLatitude),
      deliveryLongitude: new Prisma.Decimal(order.deliveryLongitude),
      status: order.status,
      deliveryDate: order.deliveryDate,
      pickupDate: order.pickupDate,
      returnedDate: order.returnedDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
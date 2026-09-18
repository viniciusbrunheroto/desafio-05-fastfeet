import { FindManyNearbyParams, FindManyOrdersParams, OrdersRepository } from '#src/domain/transportation/application/repositories/orders-repository.js'
import { Order, OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'
import { Order as PrismaOrder, Prisma } from '#src/generated/prisma/client.js'
import { Injectable } from '@nestjs/common'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper.js'
import { PrismaService } from '../prisma.service.js'
import { DomainEvents } from '#src/core/events/domain-events.js'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {

  constructor(
    private prisma: PrismaService
  ) {
  } 

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      }
    })

    if (!order) {
      return null
    }

    return PrismaOrdersMapper.toDomain(order)
  }

  async findManyDeliveredByDeliveryPersonId(deliveryPersonId: string) {

    const orders = await this.prisma.order.findMany({
      where: {
        deliveryPersonId,
        status: OrderStatus.DELIVERED
      }
    })

    return orders.map(PrismaOrdersMapper.toDomain)
  }

  async findManyByDeliveryPersonId(deliveryPersonId: string, {page, neighborhood, status}: FindManyOrdersParams) {
    
    const orders = await this.prisma.order.findMany({
      where: {
        deliveryPersonId,
        status : status 
          ? status === 'pending'
            ? OrderStatus.PENDING
            : OrderStatus.DELIVERED
          : undefined,
        recipient: neighborhood 
          ? {
            neighborhood: {
              contains: neighborhood,
              mode: 'insensitive'
            }
          } : undefined,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  
    return orders.map(PrismaOrdersMapper.toDomain)
  }
  
  async findManyNearby({latitude, longitude}: FindManyNearbyParams): Promise<Order[]> {

    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
    SELECT
        id,
        delivery_person_id AS "deliveryPersonId",
        recipient_id AS "recipientId",
        status,
        delivery_latitude AS "deliveryLatitude",
        delivery_longitude AS "deliveryLongitude",
        pickup_date AS "pickupDate",
        delivery_date AS "deliveryDate",
        returned_date AS "returnedDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM ${Prisma.raw(`"${process.env.DATABASE_SCHEMA}"."orders"`)}
      WHERE  ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( "delivery_latitude" ) ) * cos( radians( "delivery_longitude" ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( "delivery_latitude" ) ) ) ) <= 5
      `
    return orders.map(PrismaOrdersMapper.toDomain)
  }


  async findMany({page, neighborhood, status}: FindManyOrdersParams) {  
    
    const orders = await this.prisma.order.findMany({
      where: {
        status : status 
          ? status === 'pending'
            ? OrderStatus.PENDING
            : OrderStatus.DELIVERED
          : undefined,
        recipient: neighborhood 
          ? {
            neighborhood: {
              contains: neighborhood,
              mode: 'insensitive'
            }
          } : undefined,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    

    return orders.map(PrismaOrdersMapper.toDomain)
  }

  async create(order: Order) {
    const data = PrismaOrdersMapper.toPrisma(order)
    
    await this.prisma.order.create({
      data,
    })
  }

  async save(newOrder: Order) {
    const data = PrismaOrdersMapper.toPrisma(newOrder)
   
    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(newOrder.id)
    
  }

  async delete(orderToBeDeleted: Order) {
    const data = PrismaOrdersMapper.toPrisma(orderToBeDeleted)
   
    await this.prisma.order.delete({
      where: {
        id: data.id,
      }
    })
  }
}
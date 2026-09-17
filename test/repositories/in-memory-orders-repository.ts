import { FindManyNearbyParams, FindManyOrdersParams, OrdersRepository } from '#src/domain/transportation/application/repositories/orders-repository.js'
import { Order, OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates.js'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository.js'

export class InMemoryOrdersRepository implements OrdersRepository {
 
  public orders: Order[] = []

  constructor(
    private recipientsRepository: InMemoryRecipientsRepository
  ) {} 

  async findById(id: string) {
    const order = this.orders.find(order => order.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyDeliveredByDeliveryPersonId(deliveryPersonId: string) {
    return this.orders.filter(
      order => order.deliveryPersonId?.toString() === deliveryPersonId &&
      order.status === OrderStatus.DELIVERED
    )
  }

  async findManyByDeliveryPersonId(deliveryPersonId: string, {page, neighborhood, status}: FindManyOrdersParams) {

    let orders: Order[] = this.orders

    orders = orders.filter(
      order => order.deliveryPersonId?.toString() === deliveryPersonId,
    )

    if (neighborhood !== undefined) {
      const recipients = this.recipientsRepository.recipients.filter((recipient) => recipient.neighborhood === neighborhood)
    
      const recipientIds = recipients.map((recipient) => recipient.id.toString())

      orders = orders
        .filter((order) => recipientIds.includes(order.recipientId.toString()) )

    }

    if (status !== undefined) {
      if (status === 'pending') {
        orders = orders
          .filter((order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.PICKED_UP )
      }

      if (status === 'delivered') {
        orders = orders
          .filter((order) => order.status === OrderStatus.DELIVERED)
      }
    }
    
    return orders.slice(((page - 1) * 20), page * 20)
  }
  
  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    return this.orders.filter(order => {
      const distance = getDistanceBetweenCoordinates(
        {latitude: params.latitude, longitude: params.longitude},
        {latitude: order.deliveryLatitude, longitude: order.deliveryLongitude}
      )

      return distance < 5
    })
  }

  async findMany({page, neighborhood, status}: FindManyOrdersParams) {

    let orders: Order[] = this.orders

    if (neighborhood !== undefined) {
      const recipients = this.recipientsRepository.recipients.filter((recipient) => recipient.neighborhood === neighborhood)
    
      const recipientIds = recipients.map((recipient) => recipient.id.toString())

      orders = orders
        .filter((order) => recipientIds.includes(order.recipientId.toString()) )

    }

    if (status !== undefined) {
      if (status === 'pending') {
        orders = orders
          .filter((order) => order.status === OrderStatus.PENDING || order.status === OrderStatus.PICKED_UP )
      }

      if (status === 'delivered') {
        orders = orders
          .filter((order) => order.status === OrderStatus.DELIVERED)
      }
    }

    return orders.slice(((page - 1) * 20), page * 20)
  }

  async create(order: Order) {
    this.orders.push(order)
  }

  async save(newOrder: Order) {
    const orderIndex = this.orders.findIndex(order => order.id === newOrder.id )
  
    this.orders[orderIndex] = newOrder
  }

  async delete(orderToBeDeleted: Order) {
    const orderIndex = this.orders.findIndex(order => order.id === orderToBeDeleted.id)
  
    this.orders.splice(orderIndex, 1)
  }
}
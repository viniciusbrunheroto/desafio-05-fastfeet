import { Order } from '#src/domain/transportation/enterprise/entities/order.js'

export class OrderPresenter {
  static toHTTP(order: Order){
    return {
      id: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId?.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status,
      deliveryLatitude: order.deliveryLatitude,
      deliveryLongitude: order.deliveryLongitude,
      photoDelivered: order.photoDelivered,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      returnedDate: order.returnedDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      
    }
  }
}
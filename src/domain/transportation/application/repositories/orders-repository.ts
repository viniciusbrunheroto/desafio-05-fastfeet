import { Order } from '../../enterprise/entities/order.js'


export interface FindManyNearbyParams {
    latitude: number,
    longitude: number
}
export interface FindManyOrdersParams {
    page: number,
    status?: 'pending' | 'delivered',
    neighborhood?: string
}

export abstract class OrdersRepository {
    abstract findManyDeliveredByDeliveryPersonId(deliveryPersonId: string): Promise<Order[]>
    abstract findManyByDeliveryPersonId(deliveryPersonId: string, params: FindManyOrdersParams): Promise<Order[] | null>
    abstract findMany(params: FindManyOrdersParams): Promise<Order[]>
    abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
    abstract findById(id: string): Promise<Order | null>
    abstract create(order: Order) : Promise<void>
    abstract save(order: Order): Promise<void>
    abstract delete(order: Order): Promise<void>
}
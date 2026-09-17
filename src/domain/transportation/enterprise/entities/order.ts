import { Entity } from '#src/core/entities/entity.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { Optional } from '#src/core/types/optional.js'
import { Attachment } from './attachment.js'

export enum OrderStatus {
    CREATED = 'CREATED',
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED',
}

export interface OrderProps {
    deliveryPersonId?: UniqueEntityID | null,
    recipientId: UniqueEntityID,
    status: OrderStatus,
    deliveryLatitude: number,
    deliveryLongitude: number,
    photoDelivered?: Attachment | null,
    pickupDate?: Date | null,
    deliveryDate?: Date | null,
    returnedDate?: Date | null,
    createdAt: Date
    updatedAt?: Date | null,
}

export class Order extends Entity<OrderProps> {
  
  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get status() {
    return this.props.status
  }

  get deliveryLatitude() {
    return this.props.deliveryLatitude
  }

  get deliveryLongitude() {
    return this.props.deliveryLongitude
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  get returnedDate() {
    return this.props.returnedDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get photoDelivered() {
    return this.props.photoDelivered
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set deliveryPersonId(newDeliveryPersonId: UniqueEntityID | undefined | null) {

    if (newDeliveryPersonId === undefined) {
      return
    }

    this.props.deliveryPersonId = newDeliveryPersonId
    this.touch()
  }

  set deliveryLatitude(newLatitude: number) {
    this.props.deliveryLatitude = newLatitude
    this.touch()
  }

  set deliveryLongitude(newLongitude: number) {
    this.props.deliveryLongitude = newLongitude
    this.touch()
  }

  set recipientId(newRecipientId: UniqueEntityID) {
    this.props.recipientId = newRecipientId
    this.touch()
  }

  pending() {
    if (this.props.status !== OrderStatus.CREATED) {
      throw new Error('Order cannot be pending')
    }
    
    this.props.status = OrderStatus.PENDING
    this.touch()
  }

  pickup(deliveryPersonId: UniqueEntityID) {
    if (this.props.status !== OrderStatus.PENDING) {
      throw new Error('Order cannot be picked up')
    }

    this.props.status = OrderStatus.PICKED_UP
    this.props.pickupDate = new Date()
    this.props.deliveryPersonId = deliveryPersonId
    this.touch()
  }

  deliver(photo: Attachment) {
    if (this.props.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order cannot be delivered')
    }

    this.props.status = OrderStatus.DELIVERED
    this.props.deliveryDate = new Date()
    this.props.photoDelivered = photo
    this.touch()
  }

  return() {
    if (this.status !== OrderStatus.PICKED_UP) {
      throw new Error('Order cannot be returned')
    }

    this.props.status = OrderStatus.RETURNED
    this.props.returnedDate = new Date()
    this.touch()
  }

  static create(
    props: Optional<OrderProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {

    const order =  new Order({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return order
  }
}
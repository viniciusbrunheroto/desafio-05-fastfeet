import type { DomainEvent } from '#src/core/events/domain-event.js'

import type { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { Order } from '../entities/order.js'
import { OrderStatus } from '#src/generated/prisma/enums.js'

export class OrderStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public order: Order, 
    public previousStatus: OrderStatus,
    public newStatus: OrderStatus
  ) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
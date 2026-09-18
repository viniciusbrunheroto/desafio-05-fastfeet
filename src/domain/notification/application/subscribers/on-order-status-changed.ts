import { DomainEvents } from '#src/core/events/domain-events.js'
import type { EventHandler } from '#src/core/events/event-handler.js'
import { OrdersRepository } from '#src/domain/transportation/application/repositories/orders-repository.js'
import { OrderStatusChangedEvent } from '#src/domain/transportation/enterprise/events/order-status-changed-event.js'
import { SendNotificationUseCase } from '../use-cases/send-notification.js'
import { Injectable } from '@nestjs/common'


@Injectable()
export class OnOrderStatusChangedEvent implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.sendOrderStatusChangedNotification(event as OrderStatusChangedEvent),
      OrderStatusChangedEvent.name,
    )
  }

  private async sendOrderStatusChangedNotification({order, newStatus, previousStatus} : OrderStatusChangedEvent) {
    const orderFound = await this.ordersRepository.findById(
      order.id.toString()
    )

    if(orderFound) {
      await this.sendNotification.execute({
        recipientId: orderFound.recipientId.toString(),
        title: `Sua encomenda mudou para status: ${newStatus}!`,
        content: `A encomenda #${orderFound.id.toString()} mudou de ${previousStatus} para ${newStatus}!`,
      })
    }
  }
}
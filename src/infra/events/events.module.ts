import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module.js'
import { OnOrderStatusChangedEvent } from '#src/domain/notification/application/subscribers/on-order-status-changed.js'
import { SendNotificationUseCase } from '#src/domain/notification/application/use-cases/send-notification.js'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderStatusChangedEvent,
    SendNotificationUseCase,
  ]
})



export class EventsModule {}
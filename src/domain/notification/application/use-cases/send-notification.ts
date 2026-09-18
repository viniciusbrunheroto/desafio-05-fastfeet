import { Either, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'

import { Notification } from '../../enterprise/entities/notification.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { NotificationsRepository } from '../repositories/notifications-repository.js'

export interface SendNotificationUseCaseRequest {
    recipientId: string
    title: string
    content: string
}


export type SendNotificationUseCaseResponse = Either<
null,
{
    notification: Notification
}>

@Injectable()
export class SendNotificationUseCase {
  constructor(
        private notificationsRepository: NotificationsRepository
  ) {}


  async execute({
    recipientId,
    title,
    content
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {


    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
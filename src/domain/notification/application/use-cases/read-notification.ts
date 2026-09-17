import { Either, left, right } from '#src/core/either.js'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../repositories/notifications-repository.js'
import { Notification } from '../../enterprise/entities/notification.js'
import { ResourceNotFoundError } from '#src/core/errors/errors/resource-not-found-error.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'

export interface ReadNotificationUseCaseRequest {
    recipientId: string
    notificationId: string
}


export type ReadNotificationUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,  
{
    notification: Notification
}>

@Injectable()
export class ReadNotificationUseCase {
  constructor(
        private notificationsRepository: NotificationsRepository
  ) {}


  async execute({
    recipientId,
    notificationId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {


    const notification = await this.notificationsRepository.findById(notificationId)

    if(!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
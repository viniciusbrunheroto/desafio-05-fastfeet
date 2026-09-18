import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Notification, NotificationProps } from '#src/domain/notification/enterprise/entities/notification.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { PrismaNotificationMapper } from '#src/infra/database/prisma/mappers/prisma-notification-mapper.js'



export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID
) {
  const newNotification = Notification.create({
    recipientId: new UniqueEntityID(),
    title: faker.lorem.sentence(4),
    content: faker.lorem.sentence(10),
    ...override,
  }, id)

  return newNotification
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification)
    })

    return notification
  }
}

import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Notification, NotificationProps } from '#src/domain/notification/enterprise/entities/notification.js'



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

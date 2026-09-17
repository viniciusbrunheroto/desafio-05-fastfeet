import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Attachment, AttachmentProps } from '#src/domain/transportation/enterprise/entities/attachment.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { PrismaAttachmentMapper } from '#src/infra/database/prisma/mappers/prisma-attachments-mapper.js'



export function makeFileAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID
) {
  const fileAttachment = Attachment.create({
    orderId: new UniqueEntityID(),
    title: faker.lorem.slug(),
    url: faker.lorem.slug(),
    ...override,
  }, id)

  return fileAttachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const order = makeFileAttachment(data)

    await this.prisma.fileAttachment.create({
      data: PrismaAttachmentMapper.toPrisma(order)
    })

    return order
  }
}

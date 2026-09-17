import { UniqueEntityID } from '../../../../core/entities/unique-entity-id.js'
import { Prisma, FileAttachment as PrismaAttachment } from '#src/generated/prisma/client.js'
import { Attachment } from '#src/domain/transportation/enterprise/entities/attachment.js'


export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {

    return Attachment.create({    
      orderId: new UniqueEntityID(raw.orderId),
      title: raw.title,
      url: raw.url,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(
    attachment: Attachment
  ): Prisma.FileAttachmentUncheckedCreateInput {
    
    return {
      id: attachment.id.toString(),
      orderId: attachment.orderId.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
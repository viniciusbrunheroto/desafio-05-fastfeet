import { Attachment } from '#src/domain/transportation/enterprise/entities/attachment.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachments-mapper.js'
import { AttachmentsRepository } from '#src/domain/transportation/application/repositories/attachments-repository.js'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {

  constructor(private prisma: PrismaService) {}

  async findById(photoId: string) {
    const file = await this.prisma.fileAttachment.findUnique({
      where: {
        id: photoId,
      }
    })

    if (!file) {
      return null
    }

    return PrismaAttachmentMapper.toDomain(file)
  }
  
  async create(fileAttachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(fileAttachment)
        
    await this.prisma.fileAttachment.create({
      data,
    })
  }
}
import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { RecipientsRepository } from '#src/domain/transportation/application/repositories/recipient-repository.js'
import { Recipient } from '#src/domain/transportation/enterprise/entities/recipient.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { PrismaRecipientsMapper } from '../mappers/prisma-recipients-mapper.js'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {

  constructor(private prisma: PrismaService) {}

  async findById(id: string){
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id
      }
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }
  

  async findMany({page}: PaginationParams){
    const recipients = await this.prisma.recipient.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })
      

    return recipients.map(PrismaRecipientsMapper.toDomain)
  }

 
  
  async create(recipient: Recipient) {
    const data = PrismaRecipientsMapper.toPrisma(recipient)
    
    await this.prisma.recipient.create({
      data,
    })
  }

  async save(newRecipient: Recipient) {
    const data = PrismaRecipientsMapper.toPrisma(newRecipient)
    
    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(recipientToBeDeleted: Recipient) {
    const data = PrismaRecipientsMapper.toPrisma(recipientToBeDeleted)
    
    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      }
    })
  }
}
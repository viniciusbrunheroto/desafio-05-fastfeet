import { UniqueEntityID } from '../../../../core/entities/unique-entity-id.js'
import { Recipient as PrismaRecipient, Prisma } from '#src/generated/prisma/client.js'
import { Recipient } from '#src/domain/transportation/enterprise/entities/recipient.js'
import { CEP } from '#src/domain/transportation/enterprise/entities/value-objects/cep.js'


export class PrismaRecipientsMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create({
      name: raw.name,
      street: raw.street,
      state: raw.state,
      neighborhood: raw.neighborhood,
      cep: CEP.create(raw.cep),
      city: raw.city,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      street: recipient.street,
      state: recipient.state,
      neighborhood: recipient.neighborhood,
      cep: recipient.cep.toValue(),
      city: recipient.city,
    }
  }
}
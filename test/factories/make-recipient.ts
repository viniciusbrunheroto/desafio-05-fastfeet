import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Recipient, RecipientProps } from '#src/domain/transportation/enterprise/entities/recipient.js'
import { CEP } from '#src/domain/transportation/enterprise/entities/value-objects/cep.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { PrismaRecipientsMapper } from '#src/infra/database/prisma/mappers/prisma-recipients-mapper.js'

const neighborhoods = [
  'Centro',
  'Jardim Primavera',
  'Vila Nova',
  'Jardim Europa',
  'São José',
  'Vila Industrial',
  'Jardim América',
  'Jardim São Paulo',
]


export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID
) {
  const recipient = Recipient.create({
    name: faker.person.fullName(),
    street: faker.location.street(),
    state: faker.location.state(),
    neighborhood: faker.helpers.arrayElement(neighborhoods),
    city: faker.location.city(),
    cep: CEP.create(faker.location.zipCode()),
    ...override,
  }, id)

  return recipient
}


@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientsMapper.toPrisma(recipient)
    })

    return recipient
  }
}


import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { User, UserProps, UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { CPF } from '#src/domain/transportation/enterprise/entities/value-objects/cpf.js'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { generateCPF } from '../utils/cpf-generator.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { PrismaUsersMapper } from '#src/infra/database/prisma/mappers/prisma-users-mapper.js'


export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {

  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: CPF.create(generateCPF()),
    role: UserRole.DELIVERY_PERSON,
    ...override,
  }, id)

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {

  }

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user)
    })

    return user
  }
}

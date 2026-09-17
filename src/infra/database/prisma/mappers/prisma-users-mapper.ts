import { UniqueEntityID } from '../../../../core/entities/unique-entity-id.js'
import { User as PrismaUser, Prisma } from '#src/generated/prisma/client.js'
import { User, UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { CPF } from '#src/domain/transportation/enterprise/entities/value-objects/cpf.js'


export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      cpf: CPF.create(raw.cpf),
      role: UserRole[raw.role],
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      cpf: user.cpf.toValue(),
      role: UserRole[user.role]
    }
  }
}
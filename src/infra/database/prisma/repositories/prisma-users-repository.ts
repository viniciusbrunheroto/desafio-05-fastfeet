import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { UsersRepository } from '#src/domain/transportation/application/repositories/users-repository.js'
import { User, UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper.js'


@Injectable()
export class PrismaUsersRepository implements UsersRepository {

  constructor(private prisma: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }
      
  async findByCpf(cpf: string){
    const normalizedCpf = cpf.replace(/\D/g, '')

    const user = await this.prisma.user.findUnique({
      where: {
        cpf: normalizedCpf,
      }
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }


  async findByEmail(email: string){
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async findManyByRole({page}: PaginationParams, role: string) {

    const usersFound = await this.prisma.user.findMany({
      where: {
        role: role === 'ADMIN'
          ? UserRole.ADMIN
          : UserRole.DELIVERY_PERSON,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return usersFound.map(PrismaUsersMapper.toDomain)
  }


  async create(user: User) {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(newUser: User) {
    const data = PrismaUsersMapper.toPrisma(newUser)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })

  }

  async delete(userToBeDeleted: User) {
    const data = PrismaUsersMapper.toPrisma(userToBeDeleted)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      }
    })
  }
}
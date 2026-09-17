import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service.js'
import { UsersRepository } from '#src/domain/transportation/application/repositories/users-repository.js'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository.js'
import { RecipientsRepository } from '#src/domain/transportation/application/repositories/recipient-repository.js'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository.js'
import { OrdersRepository } from '#src/domain/transportation/application/repositories/orders-repository.js'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository.js'
import { AttachmentsRepository } from '#src/domain/transportation/application/repositories/attachments-repository.js'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository.js'


@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RecipientsRepository,
    OrdersRepository,
    AttachmentsRepository,
  ]
})

export class DatabaseModule {}
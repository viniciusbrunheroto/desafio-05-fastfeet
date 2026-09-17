import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { RecipientFactory } from '../../../../test/factories/make-recipient.js'


describe('Edit delivery person by id (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[PATCH] /recipients/:id', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'João da Silva',
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'Piracicaba',
        state: 'SP',
        cep: '13400-000',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'João da Silva',
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'Piracicaba',
        state: 'SP',
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
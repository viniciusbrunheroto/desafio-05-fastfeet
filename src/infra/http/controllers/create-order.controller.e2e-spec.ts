import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { RecipientFactory } from '../../../../test/factories/make-recipient.js'


describe('Create order (E2E)', () => {
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
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[POST] /orders', async () => {

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
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId,
        deliveryLatitude: -22.7253,
        deliveryLongitude:  -47.6492,
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId
      }
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase?.recipientId).toBe(recipientId)
    expect(orderOnDatabase?.status).toBe('CREATED')
  })
})
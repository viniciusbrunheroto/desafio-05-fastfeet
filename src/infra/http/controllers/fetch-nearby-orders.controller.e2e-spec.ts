import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { OrderFactory } from '../../../../test/factories/make-order.js'
import { RecipientFactory } from '../../../../test/factories/make-recipient.js'


describe('Fetch orders (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[GET] /orders/nearby', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryLatitude: -22.7422412,
        deliveryLongitude: -47.6352641,
      }),
        
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryLatitude: -22.5418212,
        deliveryLongitude: -47.9231322,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userLatitude: -22.7422412,
        userLongitude: -47.6352641,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
  })
})
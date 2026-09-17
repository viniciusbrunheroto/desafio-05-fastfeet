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
import { OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'


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
  
  test('[GET] /orders', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
      }),
        
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(2)
  })


  test('[GET] /orders?status=DELIVERED', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: OrderStatus.PENDING,
      }),
        
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: OrderStatus.DELIVERED,
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: OrderStatus.DELIVERED,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders?status=delivered')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(2)
  })

  test('[GET] /orders?neighborhood=Vila%20Cristina&status=delivered', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient1 = await recipientFactory.makePrismaRecipient({
      neighborhood: 'Jardim das Acácias'
    })

    const recipient2 = await recipientFactory.makePrismaRecipient({
      neighborhood: 'Vila Cristina'
    })

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient1.id,
        status: OrderStatus.PENDING,
      }),
        
      orderFactory.makePrismaOrder({
        recipientId: recipient2.id,
        status: OrderStatus.PICKED_UP,
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient2.id,
        status: OrderStatus.DELIVERED,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders?neighborhood=Vila%20Cristina&status=delivered')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
  })
})
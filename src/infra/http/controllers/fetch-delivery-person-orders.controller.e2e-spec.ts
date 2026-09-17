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


describe('Fetch delivery person orders (E2E)', () => {
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
  
  test('[GET] /delivery-person/orders', async () => {

    const deliveryPerson = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ 
      sub: deliveryPerson.id.toString(),
      role: deliveryPerson.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryPersonId: deliveryPerson.id,
      }),
        
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-person/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

      
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryPersonOrders: expect.arrayContaining([
        expect.objectContaining({ recipientId: recipient.id.toString() })
      ])
    })
  })


  test('[GET] /delivery-person/orders?status=DELIVERED', async () => {

    const deliveryPerson = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ 
      sub: deliveryPerson.id.toString(),
      role: deliveryPerson.role
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
        deliveryPersonId: deliveryPerson.id,
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: OrderStatus.DELIVERED,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-person/orders?status=delivered')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveryPersonOrders).toHaveLength(1)
  })

  test('[GET] /delivery-person/orders?neighborhood=Vila%20Cristina&status=delivered', async () => {

    const deliveryPerson = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ 
      sub: deliveryPerson.id.toString(),
      role: deliveryPerson.role
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
        deliveryPersonId: deliveryPerson.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-person/orders?neighborhood=Vila%20Cristina&status=delivered')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveryPersonOrders).toHaveLength(1)
  })
})
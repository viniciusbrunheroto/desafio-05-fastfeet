import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { OrderStatus } from '#src/domain/transportation/enterprise/entities/order.js'
import { AppModule } from '#src/infra/app.module.js'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { OrderFactory } from '../../../../test/factories/make-order.js'
import { RecipientFactory } from '../../../../test/factories/make-recipient.js'
import { UserFactory } from '../../../../test/factories/make-user.js'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'


describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory,OrderFactory ]
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)


    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()
    
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: OrderStatus.PICKED_UP,
      deliveryPersonId: user.id,
    })
    
    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/attachments/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png')


    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String)
    })
  })
})
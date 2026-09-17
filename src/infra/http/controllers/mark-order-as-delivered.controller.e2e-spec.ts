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
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { AttachmentFactory } from '../../../../test/factories/make-attachment.js'

describe('Mark order as returned (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory, AttachmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[PATCH] /delivery-person/orders/:orderId/deliver', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: OrderStatus.PICKED_UP,
      deliveryPersonId: user.id,
    })

    const orderId = order.id.toString()

    const attachment = await attachmentFactory.makePrismaAttachment({
      orderId: order.id,
    })
        
    const response = await request(app.getHttpServer())
      .patch(`/delivery-person/orders/${orderId}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: attachment.id.toString(),
      })

    expect(response.statusCode).toBe(204)
  
    const updatedOrder = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      }
    })

    expect(updatedOrder?.status).toBe('DELIVERED')
  })
})
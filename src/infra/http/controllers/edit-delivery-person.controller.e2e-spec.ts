import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'


describe('Edit delivery person by id (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[PATCH] /delivery-persons/:id', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const deliveryPerson = await userFactory.makePrismaUser()

    const deliveryPersonId = deliveryPerson.id.toString()


    const response = await request(app.getHttpServer())
      .patch(`/delivery-persons/${deliveryPersonId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Felipe Gonçalves',
        email: 'felipe@email.com'
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'Felipe Gonçalves',
        email: 'felipe@email.com'
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
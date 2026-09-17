import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { compare} from 'bcryptjs'

describe('Change user password (E2E)', () => {
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
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[PATCH] /users/:id/password', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const deliveryPerson = await userFactory.makePrismaUser({
      role: UserRole.DELIVERY_PERSON
    })

    const deliveryPersonId = deliveryPerson.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/users/${deliveryPersonId}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        newPassword: '1234567'
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryPersonId
      }
    })

    expect(userOnDatabase).toBeTruthy()

    const isPasswordCorrect = await compare(
      '1234567',
      userOnDatabase!.password,
    )

    expect(isPasswordCorrect).toBe(true)
  })
})
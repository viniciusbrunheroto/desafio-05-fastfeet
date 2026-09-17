import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { PrismaService } from '#src/infra/database/prisma/prisma.service.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'


describe('Create user (E2E)', () => {
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
  
  test('[POST] /users', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'João da Silva',
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'Piracicaba',
        state: 'SP',
        cep: '13400-000'
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'João da Silva',
      }
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
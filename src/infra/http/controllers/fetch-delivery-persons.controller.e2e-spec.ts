import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { AppModule } from '#src/infra/app.module.js'
import { JwtService } from '@nestjs/jwt'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '#src/infra/database/database.module.js'


describe('Fetch delivery persons (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  
  test('[GET] /delivery-persons', async () => {

    const user = await userFactory.makePrismaUser({
      role: UserRole.ADMIN
    })

    const accessToken = jwt.sign({ 
      sub: user.id.toString(),
      role: user.role
    })

    await Promise.all([
      userFactory.makePrismaUser({
        name: 'João Silva'
      }),
        
      userFactory.makePrismaUser({
        name: 'Maria do Carmo'
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-persons')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      deliveryPersons: expect.arrayContaining([
        expect.objectContaining({ name: 'João Silva'}),
        expect.objectContaining({ name: 'Maria do Carmo'}),
      ])
    })
  })
})
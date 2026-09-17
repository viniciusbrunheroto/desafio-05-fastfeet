
import { CPF } from '#src/domain/transportation/enterprise/entities/value-objects/cpf.js'
import { AppModule } from '#src/infra/app.module.js'
import { DatabaseModule } from '#src/infra/database/database.module.js'
import { UserFactory } from '../../../../test/factories/make-user.js'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'


describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  
    
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
  
    await app.init()
  })
  
  test('[POST] /auth/login', async () => {

    await userFactory.makePrismaUser({
      cpf: CPF.create('821.098.080-71'),
      password: await hash('123456', 8),
    })
  
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        cpf: '821.098.080-71',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
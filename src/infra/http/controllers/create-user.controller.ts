import { UserAlreadyExistsError } from '#src/domain/transportation/application/use-cases/errors/user-already-exists-error.js'
import { RegisterUserUseCase } from '#src/domain/transportation/application/use-cases/register-user.js'
import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { Roles } from '#src/infra/auth/roles.js'

const createUserBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  cpf: z.string(),
  email: z.email(),
  role: z.enum(UserRole).optional()
})


type CreateUserBodySchema = z.infer<typeof createUserBodySchema>


@Controller('/users')
export class CreateUserController {
  constructor(
    private registerUser: RegisterUserUseCase
  ) {}


  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body:CreateUserBodySchema ) {
    const {name, email, password, cpf, role} = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      cpf,
      role : role ?? UserRole.DELIVERY_PERSON
    })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
      case UserAlreadyExistsError:
        throw new ConflictException(error.message)
      default:
        throw new BadRequestException(error.message)
      }
    }
  }
}

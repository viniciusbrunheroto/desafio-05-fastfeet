import { AuthenticateUserUseCase } from '#src/domain/transportation/application/use-cases/authenticate-user.js'
import { Public } from '#src/infra/auth/public.js'
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { WrongCredentialsError } from '#src/domain/transportation/application/use-cases/errors/wrong-credentials-error.js'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})


type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>


@Controller('/auth/login')
@Public()
export class AuthenticateController {
  constructor(
        private authenticateUser: AuthenticateUserUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {

    const { cpf, password} = body

    const result = await this.authenticateUser.execute({
      cpf,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
      case WrongCredentialsError:
        throw new UnauthorizedException(error.message)
      default:
        throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
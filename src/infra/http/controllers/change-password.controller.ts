import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { Roles } from '#src/infra/auth/roles.js'
import { ChangePasswordUseCase } from '#src/domain/transportation/application/use-cases/change-password.js'

const changePasswordBodySchema = z.object({
  newPassword: z.string().min(6),
})

// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/users/:id/password')
export class ChangePasswordController {
  constructor(
    private changePassword: ChangePasswordUseCase
  ) {}


  @Patch()
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangePasswordBodySchema,
    @Param('id') id: string) {
    const {newPassword} = body

    const result = await this.changePassword.execute({
      userId: id,
      newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

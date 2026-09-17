import { BadRequestException, Controller, HttpCode, Param, Patch, UnauthorizedException } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { MarkOrderAsPendingUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-pending.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'

@Controller('/orders/:orderId/pending')
export class MarkOrderAsPendingController {
  constructor(
        private markOrderAsPending: MarkOrderAsPendingUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('orderId') id: string) {


    const result = await this.markOrderAsPending.execute({
      orderId: id,
    })

    if (result.isLeft()) {
      const error = result.value
             
      switch(error.constructor) {
      case NotAllowedError:
        throw new UnauthorizedException(error.message)
      default:
        throw new BadRequestException(error.message)
      }
    }
  }
}
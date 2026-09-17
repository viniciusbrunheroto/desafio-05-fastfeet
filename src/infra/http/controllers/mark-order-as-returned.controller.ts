import { BadRequestException, Controller, HttpCode, Param, Patch, UnauthorizedException } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { MarkOrderAsReturnedUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-returned.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'

@Controller('/delivery-person/orders/:orderId/return')
export class MarkOrderAsReturnedController {
  constructor(
        private markOrderAsReturned: MarkOrderAsReturnedUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
    @Param('orderId') id: string,
    @CurrentUser() user: UserPayload) {

    const {sub: userId} = user

    const result = await this.markOrderAsReturned.execute({
      orderId: id,
      deliveryPersonId: userId,
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
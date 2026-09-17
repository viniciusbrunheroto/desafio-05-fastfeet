import { BadRequestException, Controller, HttpCode, Param, Patch, UnauthorizedException } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { PickUpOrderUseCase } from '#src/domain/transportation/application/use-cases/pick-up-order.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'

@Controller('/delivery-person/orders/:orderId/pickup')
export class PickUpOrderController {
  constructor(
        private pickUpOrder: PickUpOrderUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
    @Param('orderId') id: string,
    @CurrentUser() user: UserPayload) {

    const { sub: userId} = user

    const result = await this.pickUpOrder.execute({
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
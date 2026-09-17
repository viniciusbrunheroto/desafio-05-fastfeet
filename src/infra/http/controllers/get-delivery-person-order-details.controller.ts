import { BadRequestException, Controller, Get, Param, UnauthorizedException } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { GetDeliveryPersonOrderDetailsUseCase } from '#src/domain/transportation/application/use-cases/get-delivery-person-order-details.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { OrderPresenter } from '../presenters/order-presenter.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'

  
@Controller('/delivery-persons/orders/:id')
export class GetDeliveryPersonOrderDetailsController {
  constructor(
        private getDeliveryPersonOrderDetails: GetDeliveryPersonOrderDetailsUseCase
  ) {}

  @Get()
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload) {

    const { sub: userId } = user

    const result = await this.getDeliveryPersonOrderDetails.execute({
      orderId: id,
      deliveryPersonId: userId
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

    return {
      order: OrderPresenter.toHTTP(result.value.order)
    }
  }
}
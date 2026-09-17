import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { GetOrderByIdUseCase } from '#src/domain/transportation/application/use-cases/get-order-by-id.js'
import { OrderPresenter } from '../presenters/order-presenter.js'

  
@Controller('/orders/:id')
export class GetOrderByIdController {
  constructor(
        private getOrdersById: GetOrderByIdUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.getOrdersById.execute({
      orderId: id
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      order: OrderPresenter.toHTTP(result.value.order)
    }
  }
}
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { DeleteOrderUseCase } from '#src/domain/transportation/application/use-cases/delete-order.js'


@Controller('/orders/:id')
export class DeleteOrderController {
  constructor(
        private deleteOrder: DeleteOrderUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.deleteOrder.execute({
      orderId: id
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
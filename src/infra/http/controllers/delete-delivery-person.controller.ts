import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { DeleteDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/delete-delivery-person.js'


@Controller('/delivery-persons/:id')
export class DeleteDeliveryPersonController {
  constructor(
        private deleteDeliveryPerson: DeleteDeliveryPersonUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.deleteDeliveryPerson.execute({
      deliveryPersonId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
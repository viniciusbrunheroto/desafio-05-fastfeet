import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { UserPresenter } from '../presenters/user-presenter.js'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { GetDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/get-delivery-person-by-id.js'

  
@Controller('/delivery-persons/:id')
export class GetDeliveryPersonController {
  constructor(
        private getDeliveryPerson: GetDeliveryPersonUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.getDeliveryPerson.execute({
      deliveryPersonId: id
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      deliveryPerson: UserPresenter.toHTTP(result.value.deliveryPerson)
    }
  }
}
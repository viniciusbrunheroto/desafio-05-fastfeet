import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { GetRecipientByIdUseCase } from '#src/domain/transportation/application/use-cases/get-recipient-by-id.js'
import { RecipientPresenter } from '../presenters/recipient-presenter.js'

  
@Controller('/recipients/:id')
export class GetRecipientController {
  constructor(
        private getRecipients: GetRecipientByIdUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.getRecipients.execute({
      recipientId: id
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      recipient: RecipientPresenter.toHTTP(result.value.recipient)
    }
  }
}
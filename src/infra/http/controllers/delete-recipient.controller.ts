import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { DeleteRecipientUseCase } from '#src/domain/transportation/application/use-cases/delete-recipient.js'


@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(
        private deleteRecipient: DeleteRecipientUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Param('id') id: string) {

    const result = await this.deleteRecipient.execute({
      recipientId: id
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
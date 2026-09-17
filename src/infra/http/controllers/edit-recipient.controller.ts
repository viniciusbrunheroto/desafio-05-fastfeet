import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { EditRecipientUseCase } from '#src/domain/transportation/application/use-cases/edit-recipient.js'

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  street:  z.string().optional(),
  neighborhood:  z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  cep: z.string().optional(),
})

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@Controller('/recipients/:id')
export class EditRecipientController {
  constructor(
        private editRecipient: EditRecipientUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('id') id: string) {

    const { name, city, cep, neighborhood, state, street } = body

    const result = await this.editRecipient.execute({
      recipientId: id,
      name,
      city,
      cep,
      neighborhood,
      state,
      street,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
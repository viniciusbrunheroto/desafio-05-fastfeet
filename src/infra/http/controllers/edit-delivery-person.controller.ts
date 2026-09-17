import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import z from 'zod'
import { EditDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/edit-delivery-person.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const editDeliveryPersonBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
})

type EditDeliveryPersonBodySchema = z.infer<typeof editDeliveryPersonBodySchema>

// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(editDeliveryPersonBodySchema)

@Controller('/delivery-persons/:id')
export class EditDeliveryPersonController {
  constructor(
        private editDeliveryPerson: EditDeliveryPersonUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryPersonBodySchema,
    @Param('id') id: string) {

    const { name, email } = body

    const result = await this.editDeliveryPerson.execute({
      deliveryPersonId: id,
      name,
      email
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { EditOrderUseCase } from '#src/domain/transportation/application/use-cases/edit-order.js'

const editOrderBodySchema = z.object({
  deliveryPersonId: z.uuid().optional(),
  recipientId: z.uuid().optional(),
  deliveryLatitude: z.number().optional(),
  deliveryLongitude: z.number().optional(),
})

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

@Controller('/orders/:id')
export class EditOrderController {
  constructor(
        private editOrder: EditOrderUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('id') id: string) {

    const { recipientId, deliveryPersonId, deliveryLatitude, deliveryLongitude } = body

    const result = await this.editOrder.execute({
      orderId: id,
      recipientId,
      deliveryPersonId,
      deliveryLatitude,
      deliveryLongitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
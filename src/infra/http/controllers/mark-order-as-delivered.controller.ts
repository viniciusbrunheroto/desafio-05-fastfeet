import { BadRequestException, Body, Controller, HttpCode, Param, Patch, UnauthorizedException } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import { MarkOrderAsDeliveredUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-delivered.js'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { NotAllowedError } from '#src/core/errors/errors/not-allowed-error.js'


const markOrderAsDeliveredBodySchema = z.object({
  photoId: z.uuid(),
})

type MarkOrderAsDeliveredBodySchema = z.infer<typeof markOrderAsDeliveredBodySchema>

 
// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(markOrderAsDeliveredBodySchema)


@Controller('/delivery-person/orders/:orderId/deliver')
export class MarkOrderAsDeliveredController {
  constructor(
        private markOrderAsDelivered: MarkOrderAsDeliveredUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
    @Body(bodyValidationPipe) body: MarkOrderAsDeliveredBodySchema,
    @Param('orderId') id: string,
    @CurrentUser() user: UserPayload) {

    const {photoId} = body
    const { sub: userId} = user

    const result = await this.markOrderAsDelivered.execute({
      orderId: id,
      deliveryPersonId: userId,
      photoId,
    })

    if (result.isLeft()) {
      const error = result.value
       
      switch (error.constructor) {
      case NotAllowedError:
        throw new UnauthorizedException(error.message)
      default:
        throw new BadRequestException(error.message)
      }
    }
  }
}
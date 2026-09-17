import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { BadRequestException, Body , Controller, Post, UsePipes } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { Roles } from '#src/infra/auth/roles.js'
import { CreateOrderUseCase } from '#src/domain/transportation/application/use-cases/create-order.js'

const createOrderBodySchema = z.object({
  recipientId: z.uuid(),
  deliveryLatitude: z.number().refine(value => {
    return Math.abs(value) <= 90
  }),
  deliveryLongitude: z.number().refine(value => {
    return Math.abs(value) <= 180
  }),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

 
// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

@Controller('/orders')
export class CreateOrderController {
  constructor(
    private createOrder: CreateOrderUseCase
  ) {}


  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema ) {
    const {recipientId, deliveryLatitude, deliveryLongitude} = body

    const result = await this.createOrder.execute({
      recipientId,
      deliveryLatitude,
      deliveryLongitude
    })

    if(result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

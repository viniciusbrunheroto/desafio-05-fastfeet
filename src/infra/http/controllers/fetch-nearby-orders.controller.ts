import { BadRequestException, Body, Controller, Get } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import z from 'zod'
import { Roles } from '#src/infra/auth/roles.js'
import { OrderPresenter } from '../presenters/order-presenter.js'
import { FetchNearbyOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-nearby-orders.js'
import { UserRole } from '#src/generated/prisma/enums.js'

const fetchNearbyOrdersBodySchema = z.object({
  userLatitude: z.number(),
  userLongitude: z.number()
})

type FetchNearbyOrdersBodySchema = z.infer<typeof fetchNearbyOrdersBodySchema>

// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(fetchNearbyOrdersBodySchema)
  
@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(
        private fetchNearbyOrders: FetchNearbyOrdersUseCase
  ) {}

  @Get()
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
    @Body(bodyValidationPipe) body: FetchNearbyOrdersBodySchema) {

    const {userLatitude, userLongitude} = body
         
    const result = await this.fetchNearbyOrders.execute({
      userLatitude,
      userLongitude
    })

  
    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(OrderPresenter.toHTTP)
    }
  }
}
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { FetchDeliveryPersonOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-delivery-person-orders.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { OrderPresenter } from '../presenters/order-presenter.js'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'


const pageQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number) 
    .pipe(
      z.number().min(1)),
  status: z.enum(['pending', 'delivered']).optional(),
  neighborhood: z.string().optional()    
})

 type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

 
// eslint-disable-next-line no-useless-assignment
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

  
@Controller('/delivery-person/orders')
export class FetchDeliveryPersonsOrdersController {
  constructor(
        private fetchDeliveryPersonOrdersUseCase: FetchDeliveryPersonOrdersUseCase
  ) {}

  @Get()
  @Roles(UserRole.DELIVERY_PERSON)
  async handle(
   @Query(queryValidationPipe) query: PageQueryParamSchema,
   @CurrentUser() user: UserPayload) {

    const { page, status, neighborhood } = query

    const { sub: userId } = user

    const result = await this.fetchDeliveryPersonOrdersUseCase.execute({
      deliveryPersonId: userId,
      page,
      neighborhood,
      status
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const deliveryPersonOrders = result.value.orders

    return {
      deliveryPersonOrders: deliveryPersonOrders.map(OrderPresenter.toHTTP)
    }
  }
}
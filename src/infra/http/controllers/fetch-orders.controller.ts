import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import z from 'zod'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { FetchOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-orders.js'
import { OrderPresenter } from '../presenters/order-presenter.js'


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
  
@Controller('/orders')
export class FetchOrdersController {
  constructor(
        private fetchOrders: FetchOrdersUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Query(queryValidationPipe) query: PageQueryParamSchema ) {

    const { page, status, neighborhood } = query
         
    const result = await this.fetchOrders.execute({
      page,
      status,
      neighborhood,
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
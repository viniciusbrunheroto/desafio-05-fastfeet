import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import z from 'zod'
import { FetchDeliveryPersonsUseCase } from '#src/domain/transportation/application/use-cases/fetch-delivery-persons.js'
import { UserPresenter } from '../presenters/user-presenter.js'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'


const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(
    z.number().min(1)
  )

  type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

// eslint-disable-next-line no-useless-assignment
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
  
@Controller('/delivery-persons')
export class FetchDeliveryPersonsController {
  constructor(
        private fetchDeliveryPersons: FetchDeliveryPersonsUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema) {

    const result = await this.fetchDeliveryPersons.execute({
      page
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const deliveryPersons = result.value.users

    return {
      deliveryPersons: deliveryPersons.map(UserPresenter.toHTTP)
    }
  }
}
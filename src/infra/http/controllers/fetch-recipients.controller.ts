import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import z from 'zod'
import { Roles } from '#src/infra/auth/roles.js'
import { UserRole } from '#src/generated/prisma/enums.js'
import { FetchRecipientsUseCase } from '#src/domain/transportation/application/use-cases/fetch-recipients.js'
import { RecipientPresenter } from '../presenters/recipient-presenter.js'


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
  
@Controller('/recipients')
export class FetchRecipientsController {
  constructor(
        private fetchRecipients: FetchRecipientsUseCase
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema) {

    const result = await this.fetchRecipients.execute({
      page
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return {
      recipients: recipients.map(RecipientPresenter.toHTTP)
    }
  }
}
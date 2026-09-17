import { UserRole } from '#src/domain/transportation/enterprise/entities/user.js'
import { BadRequestException, Body , Controller, Post, UsePipes } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'
import { Roles } from '#src/infra/auth/roles.js'
import { CreateRecipientUseCase } from '#src/domain/transportation/application/use-cases/create-recipient.js'

const createRecipientBodySchema = z.object({
  name: z.string(),
  street: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

 
// eslint-disable-next-line no-useless-assignment
const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

@Controller('/recipients')
export class CreateRecipientController {
  constructor(
    private createRecipient: CreateRecipientUseCase
  ) {}


  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body(bodyValidationPipe) body: CreateRecipientBodySchema ) {
    const {name, street, neighborhood, cep, city, state} = body

    const result = await this.createRecipient.execute({
      name,
      street,
      neighborhood,
      cep,
      city,
      state
    })

    if(result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

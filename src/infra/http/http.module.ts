import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { DatabaseModule } from '../database/database.module.js'
import { CreateUserController } from './controllers/create-user.controller.js'
import { RegisterUserUseCase } from '#src/domain/transportation/application/use-cases/register-user.js'
import { CryptographyModule } from '../cryptography/cryptography.module.js'
import { AuthenticateController } from './controllers/authenticate.controller.js'
import { AuthenticateUserUseCase } from '#src/domain/transportation/application/use-cases/authenticate-user.js'
import { FetchDeliveryPersonsUseCase } from '#src/domain/transportation/application/use-cases/fetch-delivery-persons.js'
import { FetchDeliveryPersonsController } from './controllers/fetch-delivery-persons.controller.js'
import { GetDeliveryPersonController } from './controllers/get-delivery-person-by-id.controller.js'
import { GetDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/get-delivery-person-by-id.js'
import { EditDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/edit-delivery-person.js'
import { EditDeliveryPersonController } from './controllers/edit-delivery-person.controller.js'
import { DeleteDeliveryPersonController } from './controllers/delete-delivery-person.controller.js'
import { DeleteDeliveryPersonUseCase } from '#src/domain/transportation/application/use-cases/delete-delivery-person.js'
import { CreateRecipientController } from './controllers/create-recipient.controller.js'
import { CreateRecipientUseCase } from '#src/domain/transportation/application/use-cases/create-recipient.js'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller.js'
import { FetchRecipientsUseCase } from '#src/domain/transportation/application/use-cases/fetch-recipients.js'
import { GetRecipientController } from './controllers/get-recipient-by-id.controller.js'
import { GetRecipientByIdUseCase } from '#src/domain/transportation/application/use-cases/get-recipient-by-id.js'
import { EditRecipientController } from './controllers/edit-recipient.controller.js'
import { EditRecipientUseCase } from '#src/domain/transportation/application/use-cases/edit-recipient.js'
import { DeleteRecipientController } from './controllers/delete-recipient.controller.js'
import { DeleteRecipientUseCase } from '#src/domain/transportation/application/use-cases/delete-recipient.js'
import { CreateOrderController } from './controllers/create-order.controller.js'
import { CreateOrderUseCase } from '#src/domain/transportation/application/use-cases/create-order.js'
import { FetchOrdersController } from './controllers/fetch-orders.controller.js'
import { FetchOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-orders.js'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller.js'
import { GetOrderByIdUseCase } from '#src/domain/transportation/application/use-cases/get-order-by-id.js'
import { EditOrderController } from './controllers/edit-order.controller.js'
import { EditOrderUseCase } from '#src/domain/transportation/application/use-cases/edit-order.js'
import { DeleteOrderController } from './controllers/delete-order.controller.js'
import { DeleteOrderUseCase } from '#src/domain/transportation/application/use-cases/delete-order.js'
import { ChangePasswordController } from './controllers/change-password.controller.js'
import { ChangePasswordUseCase } from '#src/domain/transportation/application/use-cases/change-password.js'
import { FetchDeliveryPersonOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-delivery-person-orders.js'
import { FetchDeliveryPersonsOrdersController } from './controllers/fetch-delivery-person-orders.controller.js'
import { GetDeliveryPersonOrderDetailsUseCase } from '#src/domain/transportation/application/use-cases/get-delivery-person-order-details.js'
import { GetDeliveryPersonOrderDetailsController } from './controllers/get-delivery-person-order-details.controller.js'
import { MarkOrderAsPendingUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-pending.js'
import { MarkOrderAsPendingController } from './controllers/mark-order-as-pending.controller.js'
import { PickUpOrderController } from './controllers/pick-up-order.controller.js'
import { PickUpOrderUseCase } from '#src/domain/transportation/application/use-cases/pick-up-order.js'
import { MarkOrderAsReturnedController } from './controllers/mark-order-as-returned.controller.js'
import { MarkOrderAsReturnedUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-returned.js'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller.js'
import { FetchNearbyOrdersUseCase } from '#src/domain/transportation/application/use-cases/fetch-nearby-orders.js'
import { StorageModule } from '../storage/storage.module.js'
import { MarkOrderAsDeliveredController } from './controllers/mark-order-as-delivered.controller.js'
import { MarkOrderAsDeliveredUseCase } from '#src/domain/transportation/application/use-cases/mark-order-as-delivered.js'


@Module({
  imports: [PassportModule.register({defaultStrategy: 'jwt'}), DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateUserController,
    AuthenticateController,
    FetchDeliveryPersonsController,
    GetDeliveryPersonController,
    EditDeliveryPersonController,
    DeleteDeliveryPersonController,
    CreateRecipientController,
    FetchRecipientsController,
    GetRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    CreateOrderController,
    FetchOrdersController,
    FetchNearbyOrdersController,
    GetOrderByIdController,
    EditOrderController,
    DeleteOrderController,
    ChangePasswordController,
    FetchDeliveryPersonsOrdersController,
    GetDeliveryPersonOrderDetailsController,
    MarkOrderAsPendingController,
    PickUpOrderController,
    MarkOrderAsReturnedController,
    MarkOrderAsDeliveredController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    FetchDeliveryPersonsUseCase,
    GetDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
    DeleteDeliveryPersonUseCase,
    CreateRecipientUseCase,
    FetchRecipientsUseCase,
    GetRecipientByIdUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    CreateOrderUseCase,
    FetchOrdersUseCase,
    FetchNearbyOrdersUseCase,
    GetOrderByIdUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    ChangePasswordUseCase,
    FetchDeliveryPersonOrdersUseCase,
    GetDeliveryPersonOrderDetailsUseCase,
    MarkOrderAsPendingUseCase,
    PickUpOrderUseCase,
    MarkOrderAsReturnedUseCase,
    MarkOrderAsDeliveredUseCase,
  ]
})

export class HttpModule {}
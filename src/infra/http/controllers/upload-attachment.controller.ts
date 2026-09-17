import { InvalidFileTypeError } from '#src/domain/transportation/application/use-cases/errors/invalid-file-type-error.js'
import { UploadAndCreateDeliveryPhotoUseCase } from '#src/domain/transportation/application/use-cases/upload-and-create-delivery-photo.js'
import { CurrentUser } from '#src/infra/auth/current-user-decorator.js'
import type { UserPayload } from '#src/infra/auth/jwt.strategy.js'
import { Roles } from '#src/infra/auth/roles.js'
import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments/orders/:orderId')
export class UploadAttachmentController {
  constructor(private uploadAndCreateAttachment: UploadAndCreateDeliveryPhotoUseCase) {}

  @Post()
  @Roles('DELIVERY_PERSON')
  @UseInterceptors(FileInterceptor('file'))
  async handle( 
    @Param('orderId') id: string,
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 1024 * 1024 * 5 // 5mb
          }),
          new FileTypeValidator({ 
            fileType: '.(png|jpg|jpeg)',
          }),
        ]
      })
    ) file: Express.Multer.File){

    console.log(file)

    const {sub: userId} = user

    const result = await this.uploadAndCreateAttachment.execute({
      orderId: id,
      deliveryPersonId: userId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value
    
      switch (error.constructor) {
      case InvalidFileTypeError:
        throw new BadRequestException(error.message)
      default:
        throw new BadRequestException(error.message)
      }
    }
    
    const { fileCreated } = result.value
    
    return {
      attachmentId: fileCreated.id.toString(),
    }
  }
}
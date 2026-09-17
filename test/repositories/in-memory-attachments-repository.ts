import { AttachmentsRepository } from '#src/domain/transportation/application/repositories/attachments-repository.js'
import { Attachment } from '#src/domain/transportation/enterprise/entities/attachment.js'

export class InMemoryFileAttachmentsRepository implements AttachmentsRepository {
 

  public fileAttachments: Attachment[] = []

  async findById(photoId: string) {
    const file = this.fileAttachments.find(fileAttachment => fileAttachment.id.toString() === photoId)

    if (!file) {
      return null
    }

    return file
  }
  
  async create(fileAttachment: FileAttachment) {
    this.fileAttachments.push(fileAttachment)
  }
}
import { Attachment } from '../../enterprise/entities/attachment.js'


export abstract class AttachmentsRepository {
    abstract create(attachment: Attachment): Promise<void>
    abstract findById(photoId: string): Promise<Attachment | null>
}
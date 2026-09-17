import { Entity } from '#src/core/entities/entity.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'

export interface AttachmentProps {
    orderId: UniqueEntityID
    title: string
    url: string
}


export class Attachment extends Entity<AttachmentProps>{

  get orderId() {
    return this.props.orderId
  }

  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }


  static create(props:AttachmentProps, id?: UniqueEntityID) {
    const fileAttachment = new Attachment(props,id)

    return fileAttachment
  }
}
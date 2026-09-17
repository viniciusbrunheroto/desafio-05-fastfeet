import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { RecipientsRepository } from '#src/domain/transportation/application/repositories/recipient-repository.js'
import { Recipient } from '#src/domain/transportation/enterprise/entities/recipient.js'

export class InMemoryRecipientsRepository implements RecipientsRepository {

  public recipients: Recipient[] = []

  async findMany({page}: PaginationParams){
    const recipients = this.recipients
      .slice((page -1) * 20, page * 20)

    return recipients
  }

  async findById(id: string){
    const recipient = this.recipients.find(recipient => recipient.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }
  
  async create(recipient: Recipient) {
    this.recipients.push(recipient)
  }

  async save(newRecipient: Recipient) {
    const recipientIndex = this.recipients.findIndex(recipient => recipient.id === newRecipient.id )
  
    this.recipients[recipientIndex] = newRecipient
  }

  async delete(recipientToBeDeleted: Recipient) {
    const recipientIndex = this.recipients.findIndex(recipient => recipient.id === recipientToBeDeleted.id)

    this.recipients.splice(recipientIndex, 1)
  }
}
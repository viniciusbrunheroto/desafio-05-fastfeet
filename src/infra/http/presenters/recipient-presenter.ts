import { Recipient } from '#src/domain/transportation/enterprise/entities/recipient.js'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient){
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      street: recipient.street,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      cep: recipient.cep.toValue(),
    }
  }
}
import { Entity } from '#src/core/entities/entity.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { CEP } from './value-objects/cep.js'

export interface RecipientProps {
    name: string
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    cep: CEP,
}

export class Recipient extends Entity<RecipientProps> {

  get name() {
    return this.props.name
  }

  get street() {
    return this.props.street
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get cep() {
    return this.props.cep
  }

  set name(newName: string) {
    this.props.name = newName
  }

  set street(newStreet: string) {
    this.props.street = newStreet
  }

  set neighborhood(newNeighborhood: string) {
    this.props.neighborhood = newNeighborhood
  }

  set city(newCity: string) {
    this.props.city = newCity
  }

  set state(newState: string) {
    this.props.state = newState
  }

  set cep(newCEP: CEP) {
    this.props.cep = newCEP
  }

  
  static create(
    props: RecipientProps,
    id?: UniqueEntityID
  ) {
    const recipient = new Recipient(props,id)

    return recipient
  }
}
 
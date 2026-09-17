import { Entity } from '#src/core/entities/entity.js'
import { UniqueEntityID } from '#src/core/entities/unique-entity-id.js'
import { Optional } from '#src/core/types/optional.js'
import { CPF } from './value-objects/cpf.js'

export enum UserRole {
    ADMIN = 'ADMIN',
    DELIVERY_PERSON = 'DELIVERY_PERSON',
}

export interface UserProps {
    name: string
    password: string
    cpf: CPF
    email: string
    role: UserRole
    createdAt: Date
    updatedAt?: Date | null 
}

export class User extends Entity<UserProps> {

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.role
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }
  
  private touch() {
    this.props.updatedAt = new Date()
  }

  changePassword(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {

    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return user
  }
}
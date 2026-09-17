import { User } from '#src/domain/transportation/enterprise/entities/user.js'

export class UserPresenter {
  static toHTTP(user: User){
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
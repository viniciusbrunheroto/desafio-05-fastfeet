import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { UsersRepository } from '#src/domain/transportation/application/repositories/users-repository.js'
import { User, UserRole } from '#src/domain/transportation/enterprise/entities/user.js'

export class InMemoryUsersRepository implements UsersRepository {
 
 
  public users: User[] = []

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find(user => user.id.toString() === userId)

    if (!user) {
      return null
    }

    return user
  }
      
  async findByCpf(cpf: string){
    const normalizedCpf = cpf.replace(/\D/g, '')

    const user = this.users.find(user => user.cpf.toString() === normalizedCpf)

    if (!user) {
      return null
    }

    return user
  }


  async findByEmail(email: string){
    const user = this.users.find(user => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findManyByRole({page}: PaginationParams, role: string) {

    let usersFound: User[] = []

    if (role === 'DELIVERY_PERSON'){
      usersFound = this.users
        .filter((user) => user.role === UserRole.DELIVERY_PERSON)
        .slice((page - 1) * 20, page * 20)
    }

    if (role === 'ADMIN'){
      usersFound = this.users
        .filter((user) => user.role === UserRole.ADMIN)
        .slice((page - 1) * 20, page * 20)
    }
      
    return usersFound
  }


  async create(user: User) {
    this.users.push(user)
  }

  async save(newUser: User) {
    const userIndex = this.users.findIndex(user => user.id === newUser.id )

    this.users[userIndex] = newUser

  }

  async delete(userToBeDeleted: User) {
    const userIndex = this.users.findIndex(user => user.id === userToBeDeleted.id)

    this.users.splice(userIndex, 1)
  }
}
import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { User } from '../../enterprise/entities/user.js'

export abstract class UsersRepository {
    abstract findById(userId: string): Promise<User | null>
    abstract findByCpf(cpf: string): Promise<User | null>
    abstract findByEmail(email: string): Promise<User | null>
    abstract findManyByRole(params: PaginationParams, role: string): Promise<User[]>
    abstract create(user: User): Promise<void>
    abstract save(user: User): Promise<void>
    abstract delete(user: User): Promise<void>
}
import { PaginationParams } from '#src/core/repositories/pagination-params.js'
import { Recipient } from '../../enterprise/entities/recipient.js'

export abstract class RecipientsRepository {
    abstract findMany(params: PaginationParams): Promise<Recipient[]>
    abstract findById(id: string): Promise<Recipient | null>
    abstract create(recipient: Recipient): Promise<void>
    abstract save(recipient: Recipient): Promise<void>
    abstract delete(recipient: Recipient): Promise<void>
}

import { HashComparer } from '#src/domain/transportation/application/cryptography/hash-comparer.js'
import { HashGenerator } from '#src/domain/transportation/application/cryptography/hash-generator.js'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'



@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {

  private HASH_SALT_LENGTH = 8

  hash(plain: string){
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
  
}
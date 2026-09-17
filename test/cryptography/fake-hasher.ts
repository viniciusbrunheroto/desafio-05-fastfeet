import { HashComparer } from '#src/domain/transportation/application/cryptography/hash-comparer.js'
import { HashGenerator } from '#src/domain/transportation/application/cryptography/hash-generator.js'

export class FakeHasher implements HashGenerator, HashComparer {

  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
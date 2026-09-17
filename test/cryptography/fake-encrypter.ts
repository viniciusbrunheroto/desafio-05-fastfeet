import { Encrypter } from '#src/domain/transportation/application/cryptography/encrypter.js'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
}
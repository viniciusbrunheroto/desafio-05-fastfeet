import { HashComparer } from '#src/domain/transportation/application/cryptography/hash-comparer.js'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher.js'
import { HashGenerator } from '#src/domain/transportation/application/cryptography/hash-generator.js'
import { Encrypter } from '#src/domain/transportation/application/cryptography/encrypter.js'
import { JwtEncrypter } from './jwt-encrypter.js'


@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter},
    { provide: HashComparer, useClass: BcryptHasher},
    { provide: HashGenerator, useClass: BcryptHasher},
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator
  ]
})

export class CryptographyModule {}
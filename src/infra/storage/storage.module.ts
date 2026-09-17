import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage.js'
import { EnvModule } from '../env/env.module.js'
import { Uploader } from '#src/domain/transportation/application/storage/uploader.js'


@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    }
  ],
  exports: [
    Uploader,
  ]
})
export class StorageModule{}
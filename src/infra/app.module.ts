import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env.js'
import { EnvModule } from './env/env.module.js'
import { HttpModule } from './http/http.module.js'
import { AuthModule } from './auth/auth.module.js'
import { EventsModule } from './events/events.module.js'

@Module({
  imports: [ConfigModule.forRoot({
    validate: fileEnv => envSchema.parse({ ...fileEnv, ...process.env}),
    isGlobal: true,
  }), EnvModule, HttpModule, AuthModule, EventsModule],
})
export class AppModule {}

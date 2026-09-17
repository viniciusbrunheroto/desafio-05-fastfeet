import { PrismaClient } from '#src/generated/prisma/client.js'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy {
  constructor(
        private configService: ConfigService
  ){
    const databaseUrl = process.env.DATABASE_URL
    const databaseSchema = process.env.DATABASE_SCHEMA

    if(!databaseUrl) {
      throw new Error('DATABASE_URL is not defined')
    }

    const adapter = new PrismaPg(
      {connectionString: databaseUrl},
      {schema: databaseSchema})

    super({
      adapter,
      log: ['warn', 'error']
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
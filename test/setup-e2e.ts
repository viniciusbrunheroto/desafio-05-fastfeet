
import { PrismaClient } from '#src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import {config} from 'dotenv'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({ path: '.env', override: true})
config({ path: '.env.test', override: true})

let prisma!: PrismaClient
const schemaId = randomUUID()


function generateUniqueDatabaseURL (schemaId: string) {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('Please, provide a DATABASE_URL environment variable.')
  }

  const url = new URL(databaseUrl)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}


beforeAll(async () => {
  const databaseURL =generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  process.env.DATABASE_SCHEMA = schemaId

  const adapter = new PrismaPg(
    {connectionString: databaseURL},
    {schema: schemaId}
  )

  prisma = new PrismaClient({ adapter})

  execSync('pnpm prisma migrate deploy')
})


afterAll(async () => {
  if (prisma) {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
    )

    await prisma.$disconnect()
  }
})
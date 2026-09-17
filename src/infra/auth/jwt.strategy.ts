import { UserRole } from '#src/generated/prisma/enums.js'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import z from 'zod'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service.js'

const tokenPayload = z.object({
  sub: z.uuid(),
  role: z.enum(UserRole)
})


export type UserPayload = z.infer<typeof tokenPayload>


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  } 


  async validate(payload: UserPayload) {
    return tokenPayload.parse(payload)
  }
}
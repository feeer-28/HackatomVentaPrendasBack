import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

export default class JwtMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization') || ''
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      return ctx.response.unauthorized({ message: 'Token Bearer requerido' })
    }

    const token = authHeader.slice(7).trim()
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return ctx.response.internalServerError({ message: 'JWT_SECRET no configurado' })
    }

    try {
      const payload = jwt.verify(token, secret) as any
      ;(ctx as any).authUser = payload
      await next()
    } catch {
      return ctx.response.unauthorized({ message: 'Token inválido o expirado' })
    }
  }
}

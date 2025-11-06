import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import jwt from 'jsonwebtoken'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const {
      nombres,
      apellidos,
      identificacion,
      telefono,
      email,
      password,
      rol,
      idsucursal,
    } = request.only([
      'nombres',
      'apellidos',
      'identificacion',
      'telefono',
      'email',
      'password',
      'rol',
      'idsucursal',
    ])

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/
    const emailRegex = /^[\w.+-]+@([\w-]+\.)+com$/i

    if (!password || !passwordRegex.test(password)) {
      return response.badRequest({
        message:
          'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
      })
    }

    if (!email || !emailRegex.test(email)) {
      return response.badRequest({
        message: 'El correo debe ser válido y terminar en .com (ej: gmail.com, hotmail.com).',
      })
    }

    const exists = await Usuario.query().where('email', email).first()
    if (exists) {
      return response.conflict({ message: 'El email ya está registrado.' })
    }

    const usuario = await Usuario.create({
      nombres,
      apellidos,
      identificacion,
      telefono,
      email,
      password, 
      rol,
      idsucursal,
    })

    const { password: _, ...safe } = usuario.$attributes as any
    return response.created({ message: 'Registrado correctamente', usuario: safe })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const emailRegex = /^[\w.+-]+@([\w-]+\.)+com$/i
    if (!email || !emailRegex.test(email)) {
      return response.badRequest({
        message: 'El correo debe ser válido y terminar en .com (ej: gmail.com, hotmail.com).',
      })
    }

    const user = await Usuario.query().where('email', email).first()
    if (!user || user.password !== password) {
      return response.unauthorized({ message: 'Credenciales inválidas' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return response.internalServerError({ message: 'JWT_SECRET no configurado' })
    }
    const payload = { id: user.id, email: user.email, rol: (user as any).rol }
    const expiresIn = process.env.JWT_EXPIRES || '1h'
    const token = jwt.sign(payload, secret, { expiresIn })

    const { password: _, ...safe } = user.$attributes as any
    return response.ok({ message: 'Inicio de sesión exitoso', token, expiresIn, usuario: safe })
  }

  async logout({ response }: HttpContext) {
    // Logout sin estado: el cliente debe descartar cualquier token/sesión del lado del cliente
    return response.ok({ message: 'Sesión cerrada' })
  }
}

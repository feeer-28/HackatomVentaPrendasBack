import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UserController {
  async obtener({ response }: HttpContext) {
    const usuarios = await Usuario.query()
    return response.ok(usuarios)
  }

  async obtenerPorId({ params, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ message: 'Usuario no encontrado' })
    return response.ok(usuario)
  }

  async actualizar({ params, request, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ message: 'Usuario no encontrado' })
    const data = request.only(['nombres', 'apellidos', 'identificacion', 'telefono', 'email', 'rol', 'idsucursal'])
    usuario.merge(data)
    await usuario.save()
    return response.ok(usuario)
  }
}


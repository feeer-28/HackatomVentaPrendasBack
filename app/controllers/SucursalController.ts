import type { HttpContext } from '@adonisjs/core/http'
import Sucursal from '#models/sucursal'

export default class SucursalController {
  async crear({ request, response }: HttpContext) {
    const data = request.only(['idmunicipio', 'nit', 'nombre', 'direccion', 'email'])
    const created = await Sucursal.create(data)
    return response.created(created)
  }

  async obtener({ response }: HttpContext) {
    const sucursales = await Sucursal.query()
    return response.ok(sucursales)
  }

  async obtenerPorId({ params, response }: HttpContext) {
    const item = await Sucursal.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    return response.ok(item)
  }

  async actualizar({ params, request, response }: HttpContext) {
    const item = await Sucursal.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    const data = request.only(['idmunicipio', 'nit', 'nombre', 'direccion', 'email'])
    item.merge(data)
    await item.save()
    return response.ok(item)
  }

  async eliminar({ params, response }: HttpContext) {
    const item = await Sucursal.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    await item.delete()
    return response.ok({ message: 'Eliminado' })
  }
}


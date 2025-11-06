import type { HttpContext } from '@adonisjs/core/http'
import Inventario from '#models/inventario'

export default class InventarioController {
  async crear({ request, response }: HttpContext) {
    const data = request.only(['idproducto', 'idsucursal', 'stock'])
    const created = await Inventario.create(data)
    return response.created(created)
  }

  async obtener({ response }: HttpContext) {
    const inventarios = await Inventario.query()
      .preload('producto')
      .preload('sucursal')
    return response.ok(inventarios)
  }

  async obtenerPorId({ params, response }: HttpContext) {
    const item = await Inventario.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    return response.ok(item)
  }

  async actualizar({ params, request, response }: HttpContext) {
    const item = await Inventario.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    const data = request.only(['idproducto', 'idsucursal', 'stock'])
    item.merge(data)
    await item.save()
    return response.ok(item)
  }

  async eliminar({ params, response }: HttpContext) {
    const item = await Inventario.find(params.id)
    if (!item) return response.notFound({ message: 'No encontrado' })
    await item.delete()
    return response.ok({ message: 'Eliminado' })
  }

  async eliminarProductoDeInventario({ request, response }: HttpContext) {
    const { idproducto, idsucursal } = request.only(['idproducto', 'idsucursal'])
    if (!idproducto || !idsucursal) {
      return response.badRequest({ message: 'idproducto e idsucursal son requeridos' })
    }
    const item = await Inventario.query()
      .where('idproducto', idproducto)
      .andWhere('idsucursal', idsucursal)
      .first()
    if (!item) {
      return response.notFound({ message: 'Inventario no encontrado para el producto y sucursal dados' })
    }
    await item.delete()
    return response.ok({ message: 'Eliminado', id: item.id })
  }
}

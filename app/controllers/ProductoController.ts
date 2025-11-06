import type { HttpContext } from '@adonisjs/core/http'
import Producto from '#models/producto'

export default class ProductoController {
  async crear({ request, response }: HttpContext) {
    const data = request.only([
      'idsubcategoria',
      'nombre',
      'marca',
      'precio',
      'talla',
      'descripcion',
    ])
    const created = await Producto.create(data)
    return response.created(created)
  }

  async obtener({ response }: HttpContext) {
    const productos = await Producto.query()
    return response.ok(productos)
  }

  async obtenerPorId({ params, response }: HttpContext) {
    const producto = await Producto.find(params.id)
    if (!producto) return response.notFound({ message: 'No encontrado' })
    return response.ok(producto)
  }

  async actualizar({ params, request, response }: HttpContext) {
    const producto = await Producto.find(params.id)
    if (!producto) return response.notFound({ message: 'No encontrado' })
    const data = request.only([
      'idsubcategoria',
      'nombre',
      'marca',
      'precio',
      'talla',
      'descripcion',
    ])
    producto.merge(data)
    await producto.save()
    return response.ok(producto)
  }

  async eliminar({ params, response }: HttpContext) {
    const producto = await Producto.find(params.id)
    if (!producto) return response.notFound({ message: 'No encontrado' })
    await producto.delete()
    return response.ok({ message: 'Eliminado' })
  }
}

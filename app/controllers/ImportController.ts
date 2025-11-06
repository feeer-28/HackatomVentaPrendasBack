import type { HttpContext } from '@adonisjs/core/http'
import ImportProductosService from '#services/import_productos_service'

export default class ImportController {
  async importarProductos({ request, response }: HttpContext) {
    // Autenticación básica por header Bearer (placeholder)
    const authHeader = request.header('authorization') || ''
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      return response.unauthorized({ message: 'Token requerido' })
    }

    const file = request.file('file')
    const idsucursal = request.input('idsucursal') ? Number(request.input('idsucursal')) : undefined

    try {
      if (!file) {
        return response.badRequest({ message: "Archivo requerido en campo 'file'" })
      }
      // Asegurar consumir el stream del multipart moviendo a tmp
      if (typeof (file as any).moveToTmpDir === 'function') {
        await (file as any).moveToTmpDir()
      }
      const service = new ImportProductosService()
      const result = await service.procesarArchivo(file, idsucursal)
      const status = result.errors > 0 ? (result.inserted + result.updated > 0 ? 'partial' : 'error') : 'ok'
      return response.ok({ status, ...result })
    } catch (error: any) {
      return response.badRequest({ message: error.message || 'Error al importar' })
    }
  }
}

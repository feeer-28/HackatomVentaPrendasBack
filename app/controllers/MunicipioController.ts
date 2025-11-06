import type { HttpContext } from '@adonisjs/core/http'
import Municipio from '#models/municipio'

export default class MunicipioController {
  async obtener({ response }: HttpContext) {
    const municipios = await Municipio.query()
    return response.ok(municipios)
  }
}

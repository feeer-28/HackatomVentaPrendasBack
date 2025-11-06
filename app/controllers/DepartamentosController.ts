import type { HttpContext } from '@adonisjs/core/http'
import Departamento from '#models/departamento'

export default class DepartamentosController {
  async obtener({ response }: HttpContext) {
    const departamentos = await Departamento.query()
    return response.ok(departamentos)
  }
}

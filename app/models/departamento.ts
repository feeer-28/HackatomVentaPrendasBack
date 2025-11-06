import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'

export default class Departamento extends BaseModel {
  public static table = 'departamentos'

  @column({ isPrimary: true, columnName: 'iddepartamentos' })
  declare id: number

  @column({ columnName: 'nombre_dpto' })
  declare nombreDpto: string

  @hasMany(() => Municipio, { foreignKey: 'iddepartamentos' as any })
  declare municipios: HasMany<typeof Municipio>
}
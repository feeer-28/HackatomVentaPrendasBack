import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'
import Sucursal from './sucursal.js'

export default class Municipio extends BaseModel {
  public static table = 'municipio'

  @column({ isPrimary: true, columnName: 'idmunicipio' })
  declare id: number

  @column({ columnName: 'iddepartamentos' })
  declare iddepartamentos: number

  @column({ columnName: 'nombre_municipio' })
  declare nombreMunicipio: string

  @belongsTo(() => Departamento, { foreignKey: 'iddepartamentos' as any })
  declare departamento: BelongsTo<typeof Departamento>

  @hasMany(() => Sucursal, { foreignKey: 'idmunicipio' as any })
  declare sucursales: HasMany<typeof Sucursal>
}
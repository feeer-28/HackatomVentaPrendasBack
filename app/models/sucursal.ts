import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'
import Inventario from './inventario.js'
import Factura from './factura.js'
import Usuario from './usuario.js'

export default class Sucursal extends BaseModel {
  public static table = 'sucursal'

  @column({ isPrimary: true, columnName: 'idsucursal' })
  declare id: number

  @column({ columnName: 'idmunicipio' })
  declare idmunicipio: number

  @column({ columnName: 'nit' })
  declare nit: string

  @column({ columnName: 'nombre' })
  declare nombre: string

  @column({ columnName: 'direccion' })
  declare direccion: string

  @column({ columnName: 'email' })
  declare email: string

  @belongsTo(() => Municipio, { foreignKey: 'idmunicipio' as any })
  declare municipio: BelongsTo<typeof Municipio>

  @hasMany(() => Inventario, { foreignKey: 'idSucursal' as any })
  declare inventarios: HasMany<typeof Inventario>

  @hasMany(() => Factura, { foreignKey: 'idSucursal' as any })
  declare facturas: HasMany<typeof Factura>

  @hasMany(() => Usuario, { foreignKey: 'idSucursal' as any })
  declare usuarios: HasMany<typeof Usuario>
}
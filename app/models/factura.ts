import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import Sucursal from './sucursal.js'
import Detalle from './detalle.js'

export default class Factura extends BaseModel {
  public static table = 'factura'

  @column({ isPrimary: true, columnName: 'idfactura' })
  declare id: number

  @column({ columnName: 'numero_factura' })
  declare numeroFactura: string

  @column({ columnName: 'fecha' })
  declare fecha: string

  @column({ columnName: 'idcliente' })
  declare idcliente: number

  @column({ columnName: 'idsucursal' })
  declare idsucursal: number

  @belongsTo(() => Cliente, { foreignKey: 'idcliente' as any })
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Sucursal, { foreignKey: 'idsucursal' as any })
  declare sucursal: BelongsTo<typeof Sucursal>

  @hasMany(() => Detalle, { foreignKey: 'idfactura' as any })
  declare detalles: HasMany<typeof Detalle>
}
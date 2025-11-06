import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Factura from './factura.js'
import Producto from './producto.js'

export default class Detalle extends BaseModel {
  public static table = 'detalle'

  @column({ isPrimary: true, columnName: 'iddetalle' })
  declare id: number

  @column({ columnName: 'idfactura' })
  declare idfactura: number

  @column({ columnName: 'idproducto' })
  declare idproducto: number

  @column({ columnName: 'cantidad' })
  declare cantidad: number

  @column({ columnName: 'precio' })
  declare precio: number

  @column({ columnName: 'precio_total' })
  declare precioTotal: number

  @belongsTo(() => Factura, { foreignKey: 'idfactura' as any })
  declare factura: BelongsTo<typeof Factura>

  @belongsTo(() => Producto, { foreignKey: 'idproducto' as any })
  declare producto: BelongsTo<typeof Producto>
}
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Producto from './producto.js'
import Sucursal from './sucursal.js'

export default class Inventario extends BaseModel {
  public static table = 'inventario'

  @column({ isPrimary: true, columnName: 'idinventario' })
  declare id: number

  @column({ columnName: 'idproducto' })
  declare idproducto: number

  @column({ columnName: 'idsucursal' })
  declare idsucursal: number

  @column({ columnName: 'stock' })
  declare stock: number

  @belongsTo(() => Producto, { foreignKey: 'idproducto' as any })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => Sucursal, { foreignKey: 'idsucursal' as any })
  declare sucursal: BelongsTo<typeof Sucursal>
}
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Subcategoria from './subcategoria.js'
import Inventario from './inventario.js'
import Detalle from './detalle.js'

export default class Producto extends BaseModel {
  public static table = 'producto'

  @column({ isPrimary: true, columnName: 'idproducto' })
  declare id: number

  @column({ columnName: 'idsubcategoria' })
  declare idsubcategoria: number

  @column({ columnName: 'nombre' })
  declare nombre: string

  @column({ columnName: 'marca' })
  declare marca: string

  @column({ columnName: 'precio' })
  declare precio: number

  @column({ columnName: 'talla' })
  declare talla: string

  @column({ columnName: 'descripcion' })
  declare descripcion: string

  @belongsTo(() => Subcategoria, { foreignKey: 'idsubcategoria' as any })
  declare subcategoria: BelongsTo<typeof Subcategoria>

  @hasMany(() => Inventario, { foreignKey: 'idproducto' as any })
  declare inventarios: HasMany<typeof Inventario>

  @hasMany(() => Detalle, { foreignKey: 'idproducto' as any })
  declare detalles: HasMany<typeof Detalle>
}
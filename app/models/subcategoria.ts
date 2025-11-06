import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Categoria from './categoria.js'
import Producto from './producto.js'

export default class Subcategoria extends BaseModel {
  public static table = 'subcategoria'

  @column({ isPrimary: true, columnName: 'idsubcategoria' })
  declare id: number

  @column({ columnName: 'idcategoria' })
  declare idcategoria: number

  @column({ columnName: 'nombre_subcategoria' })
  declare nombreSubcategoria: string

  @belongsTo(() => Categoria, { foreignKey: 'idcategoria' as any })
  declare categoria: BelongsTo<typeof Categoria>

  @hasMany(() => Producto, { foreignKey: 'idsubcategoria' as any })
  declare productos: HasMany<typeof Producto>
}
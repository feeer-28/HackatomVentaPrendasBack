import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Subcategoria from './subcategoria.js'

export default class Categoria extends BaseModel {
  public static table = 'categoria'

  @column({ isPrimary: true, columnName: 'idcategoria' })
  declare id: number

  @column({ columnName: 'nombre_categoria' })
  declare nombreCategoria: string

  @hasMany(() => Subcategoria, { foreignKey: 'idcategoria' as any })
  declare subcategorias: HasMany<typeof Subcategoria>
}
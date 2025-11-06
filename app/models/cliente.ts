import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Factura from './factura.js'

export default class Cliente extends BaseModel {
  public static table = 'cliente'

  @column({ isPrimary: true, columnName: 'idcliente' })
  declare id: number

  @column({ columnName: 'nombres' })
  declare nombres: string

  @column({ columnName: 'identificacion' })
  declare identificacion: string

  @column({ columnName: 'email' })
  declare email: string

  @hasMany(() => Factura, { foreignKey: 'idCliente' as any })
  declare facturas: HasMany<typeof Factura>
}
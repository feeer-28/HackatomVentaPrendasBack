import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sucursal from './sucursal.js'

export default class Usuario extends BaseModel {
  public static table = 'usuario'

  @column({ isPrimary: true, columnName: 'idusuario' })
  declare id: number

  @column({ columnName: 'nombres' })
  declare nombres: string

  @column({ columnName: 'apellidos' })
  declare apellidos: string

  @column({ columnName: 'identificacion' })
  declare identificacion: string

  @column({ columnName: 'telefono' })
  declare telefono: string

  @column({ columnName: 'email' })
  declare email: string

  @column({ columnName: 'password' })
  declare password: string

  @column({ columnName: 'rol' })
  declare rol: 'empleado' | 'administrador'

  @column({ columnName: 'idsucursal' })
  declare idsucursal: number

  @belongsTo(() => Sucursal, { foreignKey: 'idsucursal' as any })
  declare sucursal: BelongsTo<typeof Sucursal>
}

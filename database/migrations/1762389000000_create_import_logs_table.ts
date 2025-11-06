import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'import_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').nullable()
      table.string('file_name', 255).nullable()
      table.timestamp('uploaded_at', { useTz: false }).defaultTo(this.now())
      table.integer('rows_total').notNullable().defaultTo(0)
      table.integer('rows_ok').notNullable().defaultTo(0)
      table.integer('rows_error').notNullable().defaultTo(0)
      table.jsonb('details').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

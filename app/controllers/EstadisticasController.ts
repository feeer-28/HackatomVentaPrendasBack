import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'

export default class EstadisticasController {
  // GET /estadisticas/mas-vendidos
  async masVendidos({ request, response }: HttpContext) {
    const mes = request.input('mes') ? Number(request.input('mes')) : null // 1-12
    const idsucursal = request.input('idsucursal') ? Number(request.input('idsucursal')) : null

    const sql = `
      SELECT
        c.idcategoria,
        c.nombre_categoria AS categoria,
        p.idproducto,
        p.nombre AS producto,
        SUM(d.cantidad) AS total_vendido
      FROM detalle d
      JOIN factura f ON f.idfactura = d.idfactura
      JOIN producto p ON p.idproducto = d.idproducto
      JOIN subcategoria s ON s.idsubcategoria = p.idsubcategoria
      JOIN categoria c ON c.idcategoria = s.idcategoria
      WHERE (CAST(? AS INT) IS NULL OR EXTRACT(MONTH FROM f.fecha::timestamp) = CAST(? AS INT))
        AND (CAST(? AS INT) IS NULL OR f.idsucursal = CAST(? AS INT))
      GROUP BY c.idcategoria, c.nombre_categoria, p.idproducto, p.nombre
      ORDER BY c.idcategoria ASC, total_vendido DESC
    `

    const { rows } = await Database.rawQuery(sql, [mes, mes, idsucursal, idsucursal])
    return response.ok(rows)
  }

  // GET /estadisticas/tallas-mayor-salida
  async tallasMayorSalida({ request, response }: HttpContext) {
    const mes = request.input('mes') ? Number(request.input('mes')) : null
    const idsucursal = request.input('idsucursal') ? Number(request.input('idsucursal')) : null

    const sql = `
      SELECT
        COALESCE(NULLIF(TRIM(p.talla), ''), 'SIN_TALLA') AS talla,
        SUM(d.cantidad) AS total_vendido
      FROM detalle d
      JOIN factura f ON f.idfactura = d.idfactura
      JOIN producto p ON p.idproducto = d.idproducto
      WHERE (CAST(? AS INT) IS NULL OR EXTRACT(MONTH FROM f.fecha::timestamp) = CAST(? AS INT))
        AND (CAST(? AS INT) IS NULL OR f.idsucursal = CAST(? AS INT))
      GROUP BY COALESCE(NULLIF(TRIM(p.talla), ''), 'SIN_TALLA')
      ORDER BY total_vendido DESC
    `

    const { rows } = await Database.rawQuery(sql, [mes, mes, idsucursal, idsucursal])
    return response.ok(rows)
  }

  // GET /estadisticas/menos-vendidos
  async menosVendidos({ request, response }: HttpContext) {
    const mes = request.input('mes') ? Number(request.input('mes')) : null
    const idsucursal = request.input('idsucursal') ? Number(request.input('idsucursal')) : null

    const sql = `
      SELECT
        c.idcategoria,
        c.nombre_categoria AS categoria,
        p.idproducto,
        p.nombre AS producto,
        SUM(d.cantidad) AS total_vendido
      FROM detalle d
      JOIN factura f ON f.idfactura = d.idfactura
      JOIN producto p ON p.idproducto = d.idproducto
      JOIN subcategoria s ON s.idsubcategoria = p.idsubcategoria
      JOIN categoria c ON c.idcategoria = s.idcategoria
      WHERE (CAST(? AS INT) IS NULL OR EXTRACT(MONTH FROM f.fecha::timestamp) = CAST(? AS INT))
        AND (CAST(? AS INT) IS NULL OR f.idsucursal = CAST(? AS INT))
      GROUP BY c.idcategoria, c.nombre_categoria, p.idproducto, p.nombre
      ORDER BY c.idcategoria ASC, total_vendido ASC
    `

    const { rows } = await Database.rawQuery(sql, [mes, mes, idsucursal, idsucursal])
    return response.ok(rows)
  }

  // POST /estadisticas/descuentoBajaRotacion
  async descuentoBajaRotacion({ request, response }: HttpContext) {
    const mes = request.input('mes') ? Number(request.input('mes')) : null
    const idsucursal = request.input('idsucursal') ? Number(request.input('idsucursal')) : null
    const porcentaje = request.input('porcentaje') ? Number(request.input('porcentaje')) : 20
    if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje >= 100) {
      return response.badRequest({ message: 'porcentaje inválido (0-100)' })
    }
    const factor = 1 - porcentaje / 100

    const trx = await Database.transaction()
    try {
      // Productos con 0 ventas según filtros
      const sqlIds = `
        SELECT p.idproducto
        FROM producto p
        LEFT JOIN detalle d ON d.idproducto = p.idproducto
        LEFT JOIN factura f ON f.idfactura = d.idfactura
          AND (CAST(? AS INT) IS NULL OR EXTRACT(MONTH FROM f.fecha::timestamp) = CAST(? AS INT))
          AND (CAST(? AS INT) IS NULL OR f.idsucursal = CAST(? AS INT))
        GROUP BY p.idproducto
        HAVING COALESCE(SUM(d.cantidad), 0) = 0
      `
      const { rows } = await trx.rawQuery(sqlIds, [mes, mes, idsucursal, idsucursal])
      const ids: number[] = rows.map((r: any) => Number(r.idproducto)).filter(Boolean)

      if (ids.length === 0) {
        await trx.commit()
        return response.ok({ porcentaje, updated: 0, productos: [] })
      }

      // Aplicar descuento: precio = ROUND(precio * factor, 2)
      for (const id of ids) {
        await trx.rawQuery('UPDATE producto SET precio = ROUND(precio * ?, 2) WHERE idproducto = ?', [factor, id])
      }

      await trx.commit()
      return response.ok({ porcentaje, updated: ids.length, productos: ids })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: 'No se pudo aplicar el descuento', error: String(error) })
    }
  }
}

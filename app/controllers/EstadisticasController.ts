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
}

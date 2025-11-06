import Database from '@adonisjs/lucid/services/db'
import Producto from '#models/producto'
import Subcategoria from '#models/subcategoria'
import Inventario from '#models/inventario'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'

export type ImportResultado = {
  inserted: number
  updated: number
  errors: number
  details: Array<{ row: number; error: string }>
  sheet?: string
  ops?: Array<{ row: number; action: 'create_product'|'update_product'|'create_inventory'|'update_inventory'; idproducto?: number; idsucursal?: number; stock?: number }>
}

export default class ImportProductosService {
  static MAX_SIZE_BYTES = 5 * 1024 * 1024
  static MIME_PERMITIDOS = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]

  async procesarArchivo(file: any, idsucursal?: number) {
    if (!file) throw new Error('Archivo requerido en campo "file"')
    const mime = file.type && file.subtype ? `${file.type}/${file.subtype}` : file.type
    const ext = (file.extname || '').toLowerCase()
    if (!ImportProductosService.MIME_PERMITIDOS.includes(mime || '') && !['xlsx', 'xls'].includes(ext)) {
      throw new Error('Tipo de archivo no permitido. Solo .xlsx o .xls')
    }
    if ((file.size || 0) > ImportProductosService.MAX_SIZE_BYTES) {
      throw new Error('El archivo supera el tamaño máximo de 5 MB')
    }

    // Leer buffer solo desde archivo temporal para evitar problemas de streams
    if (!file.tmpPath) {
      throw new Error('No se pudo almacenar el archivo temporalmente')
    }
    const buffer = await readFile(file.tmpPath)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const desired = 'Productos'
    const sheetName = workbook.SheetNames.includes(desired)
      ? desired
      : workbook.SheetNames[0]

    const sheet = workbook.Sheets[sheetName]
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null })

    // Utilidades para encabezados tolerantes
    const normalize = (s: any) =>
      typeof s === 'string'
        ? s
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
        : s
    const pick = (row: Record<string, any>, keys: string[]) => {
      const map: Record<string, any> = {}
      for (const k of Object.keys(row)) {
        map[normalize(k)] = row[k]
      }
      for (const key of keys) {
        const val = map[normalize(key)]
        if (val !== undefined) return val
      }
      // Fallback: búsqueda parcial por nombre normalizado
      for (const key of keys) {
        const target = normalize(key)
        const foundKey = Object.keys(map).find((k) => k.includes(target))
        if (foundKey) return map[foundKey]
      }
      return undefined
    }

    const trx = await Database.transaction()
    let inserted = 0
    let updated = 0
    const details: Array<{ row: number; error: string }> = []
    const ops: Array<{ row: number; action: 'create_product'|'update_product'|'create_inventory'|'update_inventory'; idproducto?: number; idsucursal?: number; stock?: number }> = []

    try {
      for (let i = 0; i < rows.length; i++) {
        const rowIndex = i + 2 // empieza en fila 2
        const raw = rows[i]

        // Mapear columnas esperadas
        const subcategoriaNombre: string | null = pick(raw, ['Subcategoría', 'Subcategoria', 'subcategoria']) ?? null
        const nombre: string | null = pick(raw, ['Nombre', 'nombre']) ?? null
        const marca: string | null = pick(raw, ['Marca', 'marca']) ?? null
        const precioRaw: any = pick(raw, ['Precio', 'precio'])
        const tallaRaw: any = pick(raw, ['Talla', 'talla'])
        const descripcion: string | null = pick(raw, ['Descripción', 'Descripcion', 'descripcion']) ?? null
        const stockRaw: any = pick(raw, ['Stock', 'stock'])

        // Filas vacías: ignorar
        if (
          !subcategoriaNombre && !nombre && !marca &&
          (precioRaw === null || precioRaw === undefined || String(precioRaw).trim() === '') &&
          (tallaRaw === null || tallaRaw === undefined || String(tallaRaw).trim() === '') &&
          !descripcion && (stockRaw === null || stockRaw === undefined || String(stockRaw).trim() === '')
        ) {
          continue
        }

        // Validaciones
        if (!subcategoriaNombre || String(subcategoriaNombre).trim() === '') {
          details.push({ row: rowIndex, error: "Subcategoría obligatoria" })
          continue
        }
        if (!subcategoriaNombre) {
          const headers = Object.keys(raw).join(', ')
          details.push({ row: rowIndex, error: `Subcategoría obligatoria. Encabezados detectados: ${headers}` })
          continue
        }
        if (!nombre || String(nombre).trim().length < 3) {
          details.push({ row: rowIndex, error: "Nombre obligatorio (mínimo 3 caracteres)" })
          continue
        }
        const precio = Number(precioRaw)
        if (!isFinite(precio) || precio <= 0 || Math.round(precio * 100) !== precio * 100) {
          details.push({ row: rowIndex, error: "Precio inválido (numérico > 0 y máx 2 decimales)" })
          continue
        }
        const stock = stockRaw === null || stockRaw === undefined || stockRaw === '' ? null : Number(stockRaw)
        if (stock !== null && (!Number.isInteger(stock) || stock < 0)) {
          details.push({ row: rowIndex, error: "Stock inválido (entero ≥ 0)" })
          continue
        }

        const talla = tallaRaw ? String(tallaRaw).trim().toUpperCase() : null
        if (descripcion && String(descripcion).length > 1000) {
          details.push({ row: rowIndex, error: "Descripción supera 1000 caracteres" })
          continue
        }

        // Buscar subcategoría por nombre exacto
        const subcat = await Subcategoria.query({ client: trx })
          .where('nombre_subcategoria', String(subcategoriaNombre).trim())
          .first()
        if (!subcat) {
          details.push({ row: rowIndex, error: `Subcategoría '${subcategoriaNombre}' no encontrada` })
          continue
        }

        // Upsert producto por nombre (puedes cambiar a SKU si lo agregan)
        const existing = await Producto.query({ client: trx }).where('nombre', nombre!).first()
        if (existing) {
          existing.merge({ idsubcategoria: subcat.id, nombre, marca: marca ?? existing.marca, precio, talla: talla ?? existing.talla, descripcion: descripcion ?? existing.descripcion })
          await existing.save()
          updated++
          ops.push({ row: rowIndex, action: 'update_product', idproducto: existing.id })

          // Inventario opcional por idsucursal
          if (idsucursal && stock !== null) {
            const inv = await Inventario.query({ client: trx })
              .where('idproducto', existing.id)
              .andWhere('idsucursal', idsucursal)
              .first()
            if (inv) {
              inv.merge({ stock })
              await inv.save()
              ops.push({ row: rowIndex, action: 'update_inventory', idproducto: existing.id, idsucursal, stock })
            } else {
              await Inventario.create({ idproducto: existing.id, idsucursal, stock }, { client: trx })
              ops.push({ row: rowIndex, action: 'create_inventory', idproducto: existing.id, idsucursal, stock })
            }
          }
        } else {
          const nuevo = await Producto.create(
            {
              idsubcategoria: subcat.id,
              nombre,
              marca: marca ?? '',
              precio,
              talla: talla ?? '',
              descripcion: descripcion ?? '',
            },
            { client: trx }
          )
          inserted++
          ops.push({ row: rowIndex, action: 'create_product', idproducto: nuevo.id })

          if (idsucursal && stock !== null) {
            await Inventario.create({ idproducto: nuevo.id, idsucursal, stock }, { client: trx })
            ops.push({ row: rowIndex, action: 'create_inventory', idproducto: nuevo.id, idsucursal, stock })
          }
        }
      }

      const resultado: ImportResultado = {
        inserted,
        updated,
        errors: details.length,
        details,
        sheet: sheetName,
        ops,
      }

      // Guardar log
      const [log] = await trx
        .insertQuery()
        .table('import_logs')
        .returning(['id'])
        .insert({
          user_id: null,
          file_name: file.clientName,
          rows_total: rows.length,
          rows_ok: inserted + updated,
          rows_error: details.length,
          details: JSON.stringify(details),
        })

      await trx.commit()
      return { ...resultado, log_id: log.id }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}

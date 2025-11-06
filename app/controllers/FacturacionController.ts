import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Cliente from '#models/cliente'
import Factura from '#models/factura'
import Detalle from '#models/detalle'
import Inventario from '#models/inventario'
import Producto from '#models/producto'

export default class FacturacionController {
  async obtener({ response }: HttpContext) {
    const facturas = await Factura.query().preload('cliente').preload('detalles')
    const data = facturas.map((f) => {
      const total = f.detalles.reduce((acc: number, d: any) => acc + Number((d as any).precioTotal || 0), 0)
      return { ...f.$attributes, cliente: f.$preloaded.cliente, detalles: f.detalles, total }
    })
    return response.ok(data)
  }

  async obtenerPorId({ params, response }: HttpContext) {
    const factura = await Factura.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('detalles')
      .first()
    if (!factura) return response.notFound({ message: 'Factura no encontrada' })
    const total = factura.detalles.reduce((acc: number, d: any) => acc + Number((d as any).precioTotal || 0), 0)
    return response.ok({ ...factura.$attributes, cliente: factura.$preloaded.cliente, detalles: factura.detalles, total })
  }

  async crear({ request, response }: HttpContext) {
    const body = request.all()
    const clienteInput = body.cliente || {}
    const facturaInput = body.factura || {}
    const detallesInput: Array<{ idproducto: number; cantidad: number; precio?: number }> =
      Array.isArray(body.detalles) ? body.detalles : []

    if (!detallesInput.length) {
      return response.badRequest({ message: 'Debe incluir al menos un detalle' })
    }
    if (!facturaInput.idsucursal) {
      return response.badRequest({ message: 'idsucursal es requerido en la factura' })
    }

    const trx = await Database.transaction()
    try {
      // Crear o reutilizar cliente por identificacion si viene, sino crear nuevo
      let cliente: Cliente | null = null
      if (clienteInput.identificacion) {
        cliente = await Cliente.query({ client: trx })
          .where('identificacion', clienteInput.identificacion)
          .first()
      }
      if (!cliente) {
        cliente = await Cliente.create(
          {
            nombres: clienteInput.nombres || '',
            identificacion: clienteInput.identificacion || '',
            email: clienteInput.email || '',
          },
          { client: trx }
        )
      }

      const numeroFactura = facturaInput.numeroFactura || facturaInput.numero || `F-${Date.now()}`
      const factura = await Factura.create(
        {
          numeroFactura: numeroFactura,
          fecha: String(facturaInput.fecha || new Date().toISOString()),
          idcliente: cliente.id,
          idsucursal: facturaInput.idsucursal,
        },
        { client: trx }
      )

      let totalFactura = 0
      for (const d of detallesInput) {
        const cantidad = Number(d.cantidad)
        if (!d.idproducto || !Number.isFinite(cantidad) || cantidad <= 0) {
          await trx.rollback()
          return response.badRequest({ message: 'Detalle inválido' })
        }

        // Precio desde el producto
        const prod = await Producto.find(d.idproducto, { client: trx })
        if (!prod) {
          await trx.rollback()
          return response.badRequest({ message: `Producto ${d.idproducto} no existe` })
        }
        const precio = Number((prod as any).precio)

        // Ajustar inventario por sucursal
        const inv = await Inventario.query({ client: trx })
          .where('idproducto', d.idproducto)
          .andWhere('idsucursal', factura.idsucursal)
          .first()
        if (!inv) {
          await trx.rollback()
          return response.badRequest({
            message: `Inventario no encontrado para producto ${d.idproducto} en sucursal ${factura.idsucursal}`,
          })
        }
        if (inv.stock < cantidad) {
          await trx.rollback()
          return response.badRequest({
            message: `Stock insuficiente para producto ${d.idproducto} en sucursal ${factura.idsucursal}`,
          })
        }
        inv.stock = inv.stock - cantidad
        inv.useTransaction(trx)
        await inv.save()

        await Detalle.create(
          {
            idfactura: factura.id,
            idproducto: d.idproducto,
            cantidad,
            precio,
            precioTotal: cantidad * precio,
          },
          { client: trx }
        )
        totalFactura += cantidad * precio
      }

      await trx.commit()
      const creada = await Factura.query()
        .where('id', factura.id)
        .preload('cliente')
        .preload('detalles')
        .firstOrFail()
      return response.created({ ...creada.$attributes, cliente: creada.$preloaded.cliente, detalles: creada.detalles, total: totalFactura })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: 'No se pudo crear la factura', error: String(error) })
    }
  }
}

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const FacturacionController = () => import('#controllers/FacturacionController')

router
  .group(() => {
    router.get('/obtener', [FacturacionController, 'obtener'])
    router.get('/obtenerPorId/:id', [FacturacionController, 'obtenerPorId'])
    router.post('/crear', [FacturacionController, 'crear'])
  })
  .use([middleware.jwt()])
  .prefix('/facturacion')
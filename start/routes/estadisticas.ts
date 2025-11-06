import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const EstadisticasController = () => import('#controllers/EstadisticasController')

router
  .group(() => {
    router.get('/masVendidos', [EstadisticasController, 'masVendidos'])
    router.get('/tallasMayorSalida', [EstadisticasController, 'tallasMayorSalida'])
    router.get('/menosVendidos', [EstadisticasController, 'menosVendidos'])
  })
  .use([middleware.jwt()])
  .prefix('/estadisticas')

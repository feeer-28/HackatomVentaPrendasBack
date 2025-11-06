import router from '@adonisjs/core/services/router'
// import { middleware } from '#start/kernel'
const SucursalController = () => import('#controllers/SucursalController')

router
  .group(() => {
    router.post('/crear', [SucursalController, 'crear'])
    router.get('/obtener', [SucursalController, 'obtener'])
    router.get('/obtenerPorId/:id', [SucursalController, 'obtenerPorId'])
    router.put('/actualizar/:id', [SucursalController, 'actualizar'])
    router.delete('/eliminar/:id', [SucursalController, 'eliminar'])
  })
  //.use([middleware.jwt()])
  .prefix('/sucursal')
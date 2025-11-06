import router from '@adonisjs/core/services/router'
const InventarioController = () => import('#controllers/InventarioController')

router
  .group(() => {
    router.post('/crear', [InventarioController, 'crear'])
    router.get('/obtener', [InventarioController, 'obtener'])
    router.get('/obtenerPorId/:id', [InventarioController, 'obtenerPorId'])
    router.put('/actualizar/:id', [InventarioController, 'actualizar'])
    router.delete('/eliminar/:id', [InventarioController, 'eliminar'])
  })
  .prefix('/inventario')

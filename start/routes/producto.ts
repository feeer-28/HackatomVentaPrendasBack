// start/routes/producto.ts
import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const ProductoController = () => import('#controllers/ProductoController')

router
  .group(() => {
    router.post('/crear', [ProductoController, 'crear'])
    router.get('/obtener', [ProductoController, 'obtener'])
    router.get('/obtenerPorId/:id', [ProductoController, 'obtenerPorId'])
    router.put('/actualizar/:id', [ProductoController, 'actualizar'])
    router.delete('/eliminar/:id', [ProductoController, 'eliminar'])
  })
  //.use([middleware.jwt()])
  .prefix('/productos')
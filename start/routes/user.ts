import router from '@adonisjs/core/services/router'
// import { middleware } from '#start/kernel'
const UserController = () => import('#controllers/UserController')

router
  .group(() => {
    router.get('/obtener', [UserController, 'obtener'])
    router.get('/obtenerPorId/:id', [UserController, 'obtenerPorId'])
    router.put('/actualizar/:id', [UserController, 'actualizar'])
  })
  //.use([middleware.jwt()])
  .prefix('/usuarios')

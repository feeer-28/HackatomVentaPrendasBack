import router from '@adonisjs/core/services/router'
// import { middleware } from '#start/kernel'
const DepartamentosController = () => import('#controllers/DepartamentosController')

router
  .group(() => {
    router.get('/obtener', [DepartamentosController, 'obtener'])
  })
  //.use([middleware.jwt()])
  .prefix('/departamentos')

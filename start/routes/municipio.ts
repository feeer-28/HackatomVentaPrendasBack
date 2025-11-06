import router from '@adonisjs/core/services/router'
// import { middleware } from '#start/kernel'
const MunicipioController = () => import('#controllers/MunicipioController')

router
  .group(() => {
    router.get('/obtener', [MunicipioController, 'obtener'])
  })
  //.use([middleware.jwt()])
  .prefix('/municipios')


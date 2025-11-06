import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const ImportController = () => import('#controllers/ImportController')

router
  .group(() => {
    router.post('/productos', [ImportController, 'importarProductos'])
  })
  //.use([middleware.jwt()])
  .prefix('/api/imports')

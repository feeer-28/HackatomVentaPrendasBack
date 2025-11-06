import router from '@adonisjs/core/services/router'
const ImportController = () => import('#controllers/ImportController')

router
  .group(() => {
    router.post('/productos', [ImportController, 'importarProductos'])
  })
  .prefix('/api/imports')

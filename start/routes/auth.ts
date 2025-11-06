import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/AuthController')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])
  })
  .prefix('/auth')

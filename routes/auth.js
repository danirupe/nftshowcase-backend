/*
  Rutas de usuarios / auth
  host + /api/v1/auth
*/

const { Router } = require('express')
const { check } = require('express-validator')
const { fieldValidator } = require('../middlewares/fieldValidator')
const { jwtValidator } = require('../middlewares/jwtValidator')
const router = Router()

const {
  crearUsuario,
  loginUsuario,
  renovarToken
} = require('../controllers/auth')

router.post(
  '/new',
  [
    //Middelwares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check(
      'password',
      'La contraseña debe contener al menos 6 caracteres'
    ).isLength({ min: 6 }),
    fieldValidator
  ],
  crearUsuario
)

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check(
      'password',
      'La contraseña debe contener al menos 6 caracteres'
    ).isLength({ min: 6 }),
    fieldValidator
  ],
  loginUsuario
)

router.get('/renew', jwtValidator, renovarToken)

module.exports = router

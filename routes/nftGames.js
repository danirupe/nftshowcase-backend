/*
  Rutas de juegos / nftgames
  host + /api/v1/nftgames
*/

const { Router } = require('express')
const { check } = require('express-validator')
const { isDate } = require('../helpers/isDate')
const { jwtValidator } = require('../middlewares/jwtValidator')
const { fieldValidator } = require('../middlewares/fieldValidator')
const router = Router()
const {
  getNftGames,
  getNftGamesPag,
  getOneNftGame,
  createNftGame,
  updateNftGame,
  deleteNftGame,
  searchNftGames
} = require('../controllers/nftGames')

router.get('/', getNftGames)

router.post('/', getNftGamesPag)

router.get('/:id', getOneNftGame)

router.post('/find', searchNftGames)

router.use(jwtValidator)

router.post(
  '/new',
  [
    check('name', 'El nombre del juego es obligatorio.').notEmpty(),
    check('web', 'La URL de la web es obligatoria').notEmpty(),
    check('description', 'La descripción breve es requerida.').notEmpty(),
    check('home_img', 'La imagen de portada es requerida.').notEmpty(),
    check(
      'release_date',
      'La fecha de lanzamiento del juego no es correcta.'
    ).custom(isDate),
    check('platforms', 'Las plataformas son requeridas').notEmpty(),
    check('content', 'La descripción del juego es obligatoria.').notEmpty(),
    fieldValidator
  ],
  createNftGame
)

router.put('/:id', updateNftGame)

router.delete('/:id', deleteNftGame)

module.exports = router

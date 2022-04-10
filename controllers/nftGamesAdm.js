const { response } = require('express')
const Game = require('../models/GameModel')
const Usuario = require('../models/UsuarioModel')

const getNftGamesAdm = async (req, res = response) => {
  const id = req.uid
  try {
    const user = await Usuario.findById(id)

    if (user && user.role === 'user') {
      const games = await Game.find({ user: id })

      return res.json({
        ok: true,
        games
      })
    } else {
      const games = await Game.find()

      return res.status(200).json({
        ok: true,
        games
      })
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: 'Contacte con el administrador.'
    })
  }
}

const getOneNftGameAdm = async (req, res = response) => {
  // Recuperamos el id de la URL
  const gameId = req.params.id

  try {
    const game = await Game.findById(gameId)

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningún juego con ese ID'
      })
    }

    // Devolvemos un mensaje con el juego solicitado.
    res.json({
      ok: true,
      game
    })
  } catch (error) {
    //console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Conacte con el administrador.'
    })
  }
}

const createNftGameAdm = async (req, res = response) => {
  console.log(req.files)
  console.log(req.uid)
  console.log(req.body)
  const game = new Game(req.body)
  try {
    game.user = req.uid

    const savedGame = await game.save()

    res.json({
      ok: true,
      msg: 'createNftGame',
      savedGame
    })
  } catch (error) {
    //console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Conacte con el administrador.'
    })
  }
}

const updateNftGameAdm = async (req, res = response) => {
  // Recuperamos el id de la URL
  const gameId = req.params.id
  //console.log(gameId)

  // En req tenemos uid y name que introducimos al hacer la validación del jwt - en jwtValidator -
  const uid = req.uid
  const role = req.role

  try {
    // Buscamos el juego que coincida con el id que recibimos en la URL
    const game = await Game.findById(gameId)
    //console.log(game)

    // Si no existe el juego, si no lo encuentra en la bd, lanzamos mensaje de error
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningún juego con ese ID'
      })
    }

    // Si existe el juego en la bd, comprobamos que su user coincide con el uid que recibimos del jwt, para verificar que el usuario que intenta editar el juego es el mismo que lo ha creado. Si no coincide, lanzamos mensaje de error.
    if (role !== 'admin')
      if (game.user.toString() !== uid) {
        return res.status(401).json({
          ok: false,
          msg: 'No puede editar este juego.'
        })
      }

    // El juego existe en la bd y el usuario tiene permisos para editar el juego. Creamos un objeto con los nuevos datos actualizados que recibimos del body y añadimos el usuario que hacer la edición, que debe ser el mismo que creo el juego.
    const newGame = {
      ...req.body
    }

    // Buscamos el juego por ID y lo actualizamos con los nuevos datos
    const gameUpdated = await Game.findByIdAndUpdate(gameId, newGame, {
      new: true
    })

    // Devolvemos un mensaje con los nuevos datos del juego actualizado.
    res.json({
      ok: true,
      game: gameUpdated
    })
  } catch (error) {
    console.log('hola', error)
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador.'
    })
  }
}

const deleteNftGameAdm = async (req, res = response) => {
  // Recuperamos el id de la URL
  const gameId = req.params.id
  // En req tenemos uid y name que introducimos al hacer la validación del jwt - en jwtValidator -
  const uid = req.uid

  try {
    // Buscamos el juego que coincida con el id que recibimos en la URL
    const game = await Game.findById(gameId)
    // Si no existe el juego, si no lo encuentra en la bd, lanzamos mensaje de error
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningún juego con ese ID'
      })
    }
    // Si existe el juego en la bd, comprobamos que su user coincide con el uid que recibimos del jwt, para verificar que el usuario que intenta editar el juego es el mismo que lo ha creado. Si no coincide, lanzamos mensaje de error.
    if (game.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No puede borrar este juego.'
      })
    }
    // Buscamos el juego por ID y lo borrramos de la bd
    await Game.findByIdAndDelete(gameId)

    // Devolvemos un mensaje tras borrar el juego
    res.json({
      ok: true,
      msg: 'Juego eliminado correctamente.'
    })
  } catch (error) {
    // console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador.'
    })
  }
}

module.exports = {
  getNftGamesAdm,
  getOneNftGameAdm,
  createNftGameAdm,
  updateNftGameAdm,
  deleteNftGameAdm
}

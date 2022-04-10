const { response } = require('express')
const Game = require('../models/GameModel')
const moment = require('moment')

const getNftGames = async (req, res = response) => {
  const games = await Game.find().populate('user', 'name')

  res.json({
    ok: true,
    games
  })
}

const getNftGamesPag = async (req, res = response) => {
  const { skip } = req.body
  const totalGames = await Game.find().count()

  const games = await Game.find({ activated: true })
    .populate('user', 'name')
    .skip(skip)
    .limit(6)

  res.json({
    ok: true,
    games,
    totalGames
  })
}

const getOneNftGame = async (req, res = response) => {
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

const createNftGame = async (req, res = response) => {
  //console.log(req.uid)
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

const updateNftGame = async (req, res = response) => {
  // Recuperamos el id de la URL
  const gameId = req.params.id
  //console.log(gameId)

  // En req tenemos uid y name que introducimos al hacer la validación del jwt - en jwtValidator -
  //const uid = req.uid

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
    // if (game.user.toString() !== uid) {
    //   return res.status(401).json({
    //     ok: false,
    //     msg: 'No puede editar este juego.'
    //   })
    // }

    // El juego existe en la bd y el usuario tiene permisos para editar el juego. Creamos un objeto con los nuevos datos actualizados que recibimos del body y añadimos el usuario que hacer la edición, que debe ser el mismo que creo el juego.
    const newGame = {
      ...req.body
      // user: uid
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
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador.'
    })
  }
}

const deleteNftGame = async (req, res = response) => {
  // Recuperamos el id de la URL
  const gameId = req.params.id
  // En req tenemos uid y name que introducimos al hacer la validación del jwt - en jwtValidator -
  const uid = req.uid
  const role = req.role

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
    if (role !== 'admin') {
      if (game.user.toString() !== uid) {
        return res.status(401).json({
          ok: false,
          msg: 'No puede borrar este juego.'
        })
      }
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

const searchNftGames = async (req, res = responde) => {
  const targetNFT = req.body.tag
  let todayDate = moment().startOf('day')
  let tomorrowDate = moment(todayDate).add(1, 'days')
  let yesterdayDate = moment(todayDate).subtract(1, 'days')

  try {
    if (targetNFT === 'next_launches') {
      const games = await Game.find({ release_date: { $gt: new Date() } })
        .sort({ release_date: 1 })
        .limit(4)

      return res.json({
        ok: true,
        games
      })
    }

    if (targetNFT === 'today_launches') {
      const games = await Game.find({
        release_date: {
          $lt: new Date(tomorrowDate),
          $gt: new Date(yesterdayDate)
        },
        activated: true
      })
        .sort({ release_date: 1 })
        .limit(1)

      return res.json({
        ok: true,
        games
      })
    }
  } catch (error) {
    console.log('Error: ', error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  getNftGames,
  getNftGamesPag,
  getOneNftGame,
  createNftGame,
  updateNftGame,
  deleteNftGame,
  searchNftGames
}

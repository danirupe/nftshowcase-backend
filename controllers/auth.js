const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/UsuarioModel')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
  //console.log(req.body)
  const { name, email, password } = req.body

  try {
    // comprobamos si el usuario ya existe en la base de datos
    let usuario = await Usuario.findOne({ email: email })
    // Si el usuario existe, mostramos el mensaje de error
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con el email introducido'
      })
    }

    // Si el usuario no existe, creamos un nuevo usuario con el modelo y los datos que vienen
    usuario = new Usuario(req.body)

    // Encriptamos la contraseña antes de guardar el usuario en la bd
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardamos el nuevo usuario en la bd
    await usuario.save()

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name, usuario.role)

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      role: usuario.role
    })
  } catch (error) {
    //console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Contacta con el administrador'
    })
  }
}

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body

  try {
    // comprobamos si existe un usuario con el email recibido
    const usuario = await Usuario.findOne({ email: email })

    // Si el usuario NO existe, mostramos el mensaje de error
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe ningún usuario con el email introducido'
      })
    }

    // Confirmar la password
    const validPassword = bcrypt.compareSync(password, usuario.password)

    // Si la contraseña recibida no es la misma que la almacenada en la bd, mostramos un error
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida'
      })
    }

    // Si las contraseñas coinciden, podemos generar el JWT
    const token = await generarJWT(usuario.id, usuario.name, usuario.role)

    res.json({
      ok: true,
      msg: 'Login',
      uid: usuario.id,
      name: usuario.name,
      token,
      role: usuario.role
    })
  } catch (error) {
    //console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Contacta con el administrador'
    })
  }
}

const renovarToken = async (req, res = response) => {
  const { uid, name, role } = req

  // Generamos nuevo token
  const token = await generarJWT(uid, name, role)

  res.json({
    ok: true,
    token,
    uid,
    name,
    role
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken
}

const { response } = require('express')
const jwt = require('jsonwebtoken')

const jwtValidator = (req, res = response, next) => {
  const token = req.header('x-token')
  //console.log(token)

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'El token no existe en la petición'
    })
  }

  try {
    // Si tenemos token correcto, obtenemos el payload
    const { uid, name, role } = jwt.verify(token, process.env.SECRET_JWT_SEED)
    //console.log(uid, name, role)

    req.uid = uid
    req.name = name
    req.role = role
  } catch (error) {
    // console.log(error)
    return res.status(200).json({
      ok: false,
      msg: 'Token no válido'
    })
  }

  next()
}

module.exports = {
  jwtValidator
}

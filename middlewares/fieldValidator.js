const { response } = require('express')
const { validationResult } = require('express-validator')

const fieldValidator = (req, res = response, next) => {
  // Errores
  const errores = validationResult(req)
  //console.log(errores)
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped()
    })
  }

  next()
}

module.exports = {
  fieldValidator
}

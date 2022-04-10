const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user'
    }
  },
  { timestamps: true }
)

module.exports = model('Usuario', UsuarioSchema)

const { Schema, model } = require('mongoose')

const GameSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    web: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    home_img: {
      type: String,
      required: true
    },
    release_date: {
      type: Date,
      required: true
    },
    platforms: {
      type: String,
      required: true
    },
    whitepaper: {
      type: String
    },
    token: {
      type: String
    },
    network: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    telegram: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    activated: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    }
  },
  { timestamps: true }
)

GameSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

module.exports = model('Game', GameSchema)

const express = require('express')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const cors = require('cors')
const { dbConnection } = require('./database/config')

// Ver todos los procesos del env
//console.log(process.env)

// Crear servidor express
const app = express()

// Base de datos
dbConnection()

// CORS
app.use(cors())

// Directorio público
app.use(express.static('public'))

// Lectura y parseo del body
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './upload'
  })
)

// Rutas
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/nftgames', require('./routes/nftGames'))
app.use('/api/v1/adm/nftgames', require('./routes/nftGamesAdm'))

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})

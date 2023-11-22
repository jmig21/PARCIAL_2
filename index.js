const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const port = 3000
const SECRET_KEY = 'JWT_SECRET_KEY' //Clave en variables de entorno .env

app.use(bodyParser.json())

//Base de datos de jugadores
let players = require('./db.json')

//Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']

  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

//Rutas
app.post('/login', (req, res) => {

  //Verificación de las credenciales de usuario y generación del token

  const username = req.body.username //El usuario se autentica con un nombre de usuario
  const user = { name: username }

  const token = jwt.sign(user, SECRET_KEY)
  res.json({ token: token })
})

//Ruta protegida con JWT
app.use(authenticateToken)

app.get('/players', (req, res) => {
  res.json(players)
})

app.post('/players', (req, res) => {
  const newPlayer = req.body
  //Validaciones y lógica para agregar un nuevo jugador
  players.post(newPlayer)
  res.json({ message: 'Jugador agregado correctamente' })
})


app.delete('/players/:id', (req, res) => {
  const playerId = req.params.id
  //Lógica para eliminar un jugador por ID
  res.json({ message: 'Jugador eliminado correctamente' })
})

//Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})

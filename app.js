require('dotenv').config()
require('./models/User')

const Koa = require('koa'),
  Router = require('koa-router'),
  koaErrorhandler = require('./middleware/errorHandler'),
  koaHealth = require('./middleware/health'),
  mongoose = require('mongoose'),
  { addTestUser } = require('./testData'),
  coordinator = require('./notification/coordinator'),
  app = new Koa(),
  router = new Router()

app.use(koaHealth)
app.use(koaErrorhandler)

mongoose.connect(process.env.MONGO_CLIENT, { useMongoClient: true }).then(
  () => console.log('Connected to database'),
  (err) => console.log('Could not connect to database: ', err))

if (process.env.NODE_ENV === 'debug') addTestUser()

coordinator.init()

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || '3011')

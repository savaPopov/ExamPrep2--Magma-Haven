//TODO import routers

const { homeRouter } = require('../controllers/home')
const { userRouter } = require('../controllers/user')
const { volcanoeRouter } = require('../controllers/volcanoes')

function configRoutes(app) {
  app.use(homeRouter)
  app.use(userRouter)
  app.use(volcanoeRouter)
  app.get('*', (req, res) => {
    res.render('404')
  })
  //TODO resiter routers

}



  module.exports = {
    configRoutes
  }
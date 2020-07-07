const express = require('express')
const path = require('path')
const cors = require('cors')

const routes = require('./routes')

class App {
  constructor() {
    this.server = express()

    this.routes()
  }

  middlewares() {
    this.server.use(express.json())

    this.server.use(cors())

    // this.server.use(
    //   '/files',
    //   express.static(path.resolve(__dirname, 'uploads')),
    // )
  }

  routes() {
    this.server.use(routes)
  }
}

module.exports = new App().server

const multer = require('multer')

const express = require('express')
const multerConfig = require('./config/multer')
const FileController = require('./app/controllers/FileController')

const { Router } = express

const routes = new Router()
const upload = multer(multerConfig)

routes.post(
  '/processa-contra-cheques',
  upload.array('files'),
  FileController.store,
)

module.exports = routes

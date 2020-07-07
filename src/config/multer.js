const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const { extname, resolve } = path

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err)

        return cb(null, res.toString('hex') + extname(file.originalname))
      })
    },
  }),
}

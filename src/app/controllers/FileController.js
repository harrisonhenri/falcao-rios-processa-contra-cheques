const fs = require('fs')
const pdfparser = require('pdf-parse')
const writeFile = require('../../lib/util')

class FileController {
  async store(req, res) {
    const results = []

    for (let index = 0; index < req.files.length; index += 1) {
      const element = req.files[index]

      const { filename: path } = element

      const pdffile = fs.readFileSync(`./src/uploads/${path}`)

      const textfile = await pdfparser(pdffile)

      const response = writeFile(
        `src/uploads/${path.split('.')[0]}.txt`,
        textfile,
      )

      results.push(response)
    }

    res.send({ results })
  }
}

module.exports = new FileController()

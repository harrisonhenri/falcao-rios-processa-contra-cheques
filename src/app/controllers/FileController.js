const fs = require('fs')
const pdfparser = require('pdf-parse')

const formatFichas = require('../../lib/formatFichas')
const formatContraChequesNovo = require('../../lib/formatContraChequesNovo')
const formatContraChequesAntigo = require('../../lib/formatContraChequesAntigo')

// const pdfparser2 = util.promisify(pdfUtil.pdfToText)

class FileController {
  async store(req, res) {
    const results = []

    if (!req.files.length)
      res.status(400).send({ message: 'The service request at least a file' })

    for (let index = 0; index < req.files.length; index += 1) {
      const element = req.files[index]

      const { filename } = element

      const fileParsedPDF = fs.readFileSync(`./src/uploads/${filename}`)

      const fileParsedTXT = (await pdfparser(fileParsedPDF)).text

      if (fileParsedTXT.indexOf('AVISO DE CRÉDITO') === -1) {
        const response = formatFichas(fileParsedTXT)
        results.push(response)
      } else if (
        fileParsedTXT.indexOf('SRH- SISTEMA INTEGRADO DE RECURSOS') === -1
      ) {
        const response = formatContraChequesNovo(fileParsedTXT)
        results.push(response)
      } else if (
        fileParsedTXT.indexOf('SRH- SISTEMA INTEGRADO DE RECURSOS') !== -1
      ) {
        const response = await formatContraChequesAntigo(
          fileParsedTXT,
          filename,
        )
        results.push(response)
      } else {
        results.push({
          message: 'Internal error, please contact the development team',
        })
      }
    }

    res.status(200).send({ results })
  }
}

module.exports = new FileController()

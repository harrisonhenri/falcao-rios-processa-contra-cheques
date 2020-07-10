const formatDate = require('./formatDate')

module.exports = function formatContraChequesNovo(ficha) {
  const splittedFile = ficha.split('\n')

  const date = splittedFile[4].split('/')

  const orgao = splittedFile[6]

  const admissao = splittedFile[12].replace(/\./g, '/')

  const chora = splittedFile[14]

  const unidade = splittedFile[17]

  const endereco = splittedFile[21]

  const numero = splittedFile[23]

  const municipio = splittedFile[26]

  const cep = splittedFile[28]

  const uf = splittedFile[30]

  const cargo = splittedFile[32]

  const pis = splittedFile[37]

  const cartProf =
    splittedFile[40] === 'CARTEIRA PROFISSIONAL' ? splittedFile[41] : ''

  const sf = cartProf ? splittedFile[43] : splittedFile[41]

  const ir = cartProf ? splittedFile[45] : splittedFile[43]

  const dataPagamento = cartProf
    ? splittedFile[47].replace(/\./g, '/')
    : splittedFile[45].replace(/\./g, '/')

  const agencia = cartProf ? splittedFile[49] : splittedFile[47]

  const contaCorrente = cartProf ? splittedFile[51] : splittedFile[49]

  const vantagensDescontosStart = splittedFile.indexOf('VANTAGENSDESCONTOS') + 2

  const vantagensDescontosEnd =
    splittedFile.indexOf(
      'DIÁRIAS EXCEDENTESVALOR. F.G.T.SBASE DE CÁLCULO IMP. RENDALÍQUIDO',
    ) - 1

  const vantagensDescontos = splittedFile.slice(
    vantagensDescontosStart,
    vantagensDescontosEnd,
  )

  const vantagens = []

  const descontos = []

  for (let index = 0; index < vantagensDescontos.length; index += 1) {
    const vantagemDesconto = vantagensDescontos[index]
      .split('  ')
      .filter(item => !!item.trim())

    const valorVantagemCodigoDesconto = vantagemDesconto[2].split(' ')

    if (vantagemDesconto.length === 5) {
      vantagens.push({
        codigo: vantagemDesconto[0].slice(0, 4).trim(),
        discriminacao: vantagemDesconto[0].slice(4).trim(),
        percentual: vantagemDesconto[1]
          .split(' ')
          .filter(item => !!item.trim())[0]
          .trim(),
        folha: '0',
        valor: valorVantagemCodigoDesconto[0].trim(),
        tipo: 'R',
      })

      descontos.push({
        codigo: valorVantagemCodigoDesconto[1].slice(0, 4).trim(),
        discriminacao: valorVantagemCodigoDesconto[1].slice(4).trim(),
        percentual: vantagemDesconto[3].trim(),
        folha: '',
        valor: vantagemDesconto[4].trim(),
        tipo: 'D',
      })
    } else if (vantagemDesconto.length === 4) {
      const descontoInfo = valorVantagemCodigoDesconto
        .slice(1)
        .join(' ')
        .split('/')

      vantagens.push({
        codigo: vantagemDesconto[0].slice(0, 4).trim(),
        discriminacao: vantagemDesconto[0].slice(4).trim(),
        percentual: vantagemDesconto[1]
          .split(' ')
          .filter(item => !!item.trim())[0]
          .trim(),
        folha: '0',
        valor: valorVantagemCodigoDesconto[0].trim(),
        tipo: 'R',
      })

      descontos.push({
        codigo: descontoInfo[0].slice(0, 4).trim(),
        discriminacao: descontoInfo[0].slice(4, -3).trim(),
        percentual: `${descontoInfo[0].slice(-3)}/${descontoInfo[1]}`.trim(),
        folha: '',
        valor: vantagemDesconto[3].trim(),
        tipo: 'D',
      })
    } else if (vantagemDesconto[1].indexOf('.') === 0) {
      vantagens.push({
        codigo: vantagemDesconto[0].slice(0, 4).trim(),
        discriminacao: vantagemDesconto[0].slice(4).trim(),
        percentual: vantagemDesconto[1]
          .split(' ')
          .filter(item => !!item.trim())[0]
          .trim(),
        folha: '0',
        valor: valorVantagemCodigoDesconto[0].trim(),
        tipo: 'R',
      })
    } else {
      descontos.push({
        codigo: vantagemDesconto[0].slice(0, 4).trim(),
        discriminacao: vantagemDesconto[0].slice(4).trim(),
        percentual: vantagemDesconto[1]
          .split(' ')
          .filter(item => !!item.trim())[0]
          .trim(),
        folha: '0',
        valor: valorVantagemCodigoDesconto[0].trim(),
        tipo: 'D',
      })
    }
  }

  const response = {}

  response[formatDate(date)] = {
    data: {
      benefeciario: '',
      orgao,
      admissao,
      chora,
      unidade,
      localTrabalho: '',
      setor: '',
      categoria: '',
      endereco,
      numero,
      compleEndereco: '',
      municipio,
      cep,
      uf,
      cargo,
      plano: '',
      nivel: '',
      padrao: '',
      classe: '',
      grau: '',
      ref: '',
      cargoComissao: '',
      situacao: '',
      pis,
      cartProf,
      sf,
      ir,
      lote: '',
      dataPagamento,
      agencia,
      contaCorrente,
    },
    vantagens,
    descontos,
  }

  return response
}

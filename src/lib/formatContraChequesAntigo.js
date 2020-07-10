const convertapi = require('convertapi')('JEdgQ54wLb3mQrEu')
const util = require('util')
const path = require('path')
const fs = require('fs')
const formatDate = require('./formatDate')

const parser = util.promisify(fs.readFile)

const tokensIndex = (tokens, fileArray) => {
  const indexes = []

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]

    indexes.push(fileArray.indexOf(token) + 1)
  }

  return indexes
}

module.exports = async function formatContraChequesAntigo(ficha, filename) {
  const resultPromise = await convertapi.convert(
    'txt',
    { File: `./src/uploads/${filename}` },
    'pdf',
  )

  await resultPromise.saveFiles(path.resolve(__dirname, '..', 'uploads'))

  const vantagens = []

  const descontos = []

  const vantagensDescontosArray = (
    await parser(`./src/uploads/${filename.split('.')[0]}.txt`)
  )
    .toString()
    .split('\n')

  const [
    descontosIndex1,
    descontosIndex2,
    vantagensIndex,
    finalDescontos,
    descontosVazios,
  ] = tokensIndex(
    [
      'CÓD    DISCRIMINAÇÃO                      DURAÇÃO HORAS%                 VALOR\r',
      'CÓD    DISCRIMINAÇÃO                       DURAÇÃO HORAS%                VALOR\r',
      'CÓD     DISCRIMINAÇÃO                     DURAÇÃO HORAS%                 VALOR\r',
      'DIÁRIAS EXCEDENTES\r',
      'CÓD    DISCRIMINAÇÃO                  DURAÇÃO HORAS%             VALOR TOTAL DE DESCONTOS\r',
    ],
    vantagensDescontosArray,
  )

  const vantagensArray = descontosVazios
    ? vantagensDescontosArray
        .slice(vantagensIndex, descontosVazios - 2)
        .filter(vantagem => {
          return vantagem !== '\r'
        })
    : vantagensDescontosArray
        .slice(vantagensIndex, descontosIndex1 || descontosIndex2 - 2)
        .filter(vantagem => {
          return vantagem !== '\r'
        })

  const descontosArray =
    !descontosVazios &&
    vantagensDescontosArray
      .slice(descontosIndex1 || descontosIndex2, finalDescontos - 1)
      .filter(vantagem => {
        return vantagem !== '\r'
      })

  for (let index = 0; index < vantagensArray.length; index += 1) {
    const vantagem = vantagensArray[index].split('  ').filter(item => {
      return !!item && item !== '\r'
    })

    if (
      vantagensArray[index + 1] &&
      vantagensArray[index + 1].split(' ').length <= 1 &&
      vantagensArray[index + 1].match(/(\d{1,}),(\d{1,})/g) !== null
    ) {
      vantagens.push({
        codigo: vantagem[0].trim(),
        discriminacao: vantagem[1].trim(),
        percentual: '1,000',
        folha: '0',
        valor: vantagensArray[index + 1].trim(),
        tipo: 'R',
      })
    } else if (vantagem.length > 1) {
      const percentual =
        vantagem.length === 4 ? vantagem[2].trim().split(' ')[0] : '1,000'

      const folha =
        percentual !== '1,000' ? vantagem[2].trim().split(' ')[1] : '0'

      vantagens.push({
        codigo: vantagem[0].trim(),
        discriminacao: vantagem[1].trim(),
        percentual,
        folha,
        valor: vantagem[vantagem.length - 1].trim(),
        tipo: 'R',
      })
    }
  }

  for (let index = 0; index < descontosArray.length; index += 1) {
    if (!descontosVazios) {
      const desconto = descontosArray[index].split('  ').filter(item => {
        return !!item && item !== '\r'
      })

      if (desconto[0].trim() !== 'TOTAL DE DESCONTOS') {
        const percentual =
          desconto.length === 4 ? desconto[2].trim().split(' ')[0] : '1,000'

        const folhaAux =
          percentual !== '1,000' ? desconto[2].trim().split(' ')[1] : '0'

        descontos.push({
          codigo: desconto[0].trim(),
          discriminacao: desconto[1].trim(),
          percentual,
          folha: folhaAux || '0',
          valor: desconto[desconto.length - 1].trim(),
          tipo: 'R',
        })
      }
    }
  }

  const file = ficha.split('\n')

  const date = file
    .find(item => {
      const match = item.match(/(\d{2})\/(\d{4})/)
      return match && match.index === 0
    })
    .split('/')

  const splittedFile = file.slice(file.indexOf(date.join('/')))

  if (
    splittedFile.indexOf(
      'O Clube de Desconto do Servidor firmou parceria em Vitória da Conquista com Étika Consultoria Imobiliária. A empresa oferece 10% de abatimento no',
    ) !== -1
  ) {
    splittedFile.splice(3, 4)
  }

  const tokens = [
    'ÓRGÃO/ENTIDADE',
    'BENEFICIÁRIO',
    'ADMISSÃO',
    'C. HORA',
    'UNIDADE',
    'LOCAL DE TRABALHO ',
    'SETOR ',
    'CATEGORIA ',
    'ENDEREÇO ',
    'NÚMERO ',
    'COMPLEMENTO ENDEREÇO ',
    'MUNICÍPIO ',
    'CEP ',
    'U.F. ',
    'CARGO/FUNÇÃO ',
    'PLANO ',
    'GRAU REF ',
    'CARGO COMISSÃO / FUNÇÃO GRATIFICADA SITUAÇÃO FUNCIONAL',
    'PIS/PASEP ',
    'CART. PROFIS. - SÉRIE ',
    'S.F. ',
    'S.F. I.R. ',
    'I.R. ',
    'LOTE ',
    'DATA PAGTO. ',
    'BANCO / AGÊNCIA ',
    'CONTA CORRENTE ',
    'LOTE DATA PAGTO. BANCO / AGÊNCIA ',
  ]

  const [
    orgaoIndex,
    benefeciarioIndex,
    admissaoIndex,
    choraIndex,
    unidadeIndex,
    localTrabalhoIndex,
    setorIndex,
    categoriaIndex,
    enderecoIndex,
    numeroIndex,
    compleEnderecoIndex,
    municipioIndex,
    cepIndex,
    ufIndex,
    cargoIndex,
    planoIndex,
    refIndex,
    situacaoIndex,
    pisIndex,
    cartProfIndex,
    sfIndex,
    sfsrIndex,
    srIndex,
    loteIndex,
    dataPagamentoIndex,
    agenciaIndex,
    contaCorrenteIndex,
    lotePagamentoContaIndex,
  ] = tokensIndex(tokens, splittedFile)

  const orgao = splittedFile[orgaoIndex]

  const benefeciario = splittedFile[benefeciarioIndex]

  const admissao = splittedFile[admissaoIndex]

  const chora = splittedFile[choraIndex]

  const unidade = splittedFile[unidadeIndex]

  const localTrabalho = splittedFile[localTrabalhoIndex]

  const setor = splittedFile[setorIndex]

  const categoria = splittedFile[categoriaIndex]

  const endereco = splittedFile[enderecoIndex]

  const numero = splittedFile[numeroIndex]

  const compleEndereco = splittedFile[compleEnderecoIndex]

  const municipio = splittedFile[municipioIndex]

  const cep = splittedFile[cepIndex]

  const uf = splittedFile[ufIndex]

  const cargo = splittedFile[cargoIndex]

  const plano = splittedFile[planoIndex]

  const ref = splittedFile[refIndex]

  const situacao = splittedFile[situacaoIndex]

  const pis = splittedFile[pisIndex]

  const cartProf = splittedFile[cartProfIndex]

  const sf = sfIndex !== 0 ? splittedFile[sfIndex] : ''

  const ir =
    srIndex !== 0
      ? splittedFile[srIndex].replace(/[^0-9]+/g, '').trim()
      : splittedFile[sfsrIndex].replace(/[^0-9]+/g, '').trim()

  const lote = lotePagamentoContaIndex ? '' : splittedFile[loteIndex]

  const dataPagamento = lotePagamentoContaIndex
    ? ''
    : splittedFile[dataPagamentoIndex]

  const agencia = lotePagamentoContaIndex
    ? splittedFile[lotePagamentoContaIndex]
    : splittedFile[agenciaIndex]

  const contaCorrente = splittedFile[contaCorrenteIndex]

  const response = {}

  response[formatDate(date)] = {
    data: {
      benefeciario,
      orgao,
      admissao,
      chora,
      unidade,
      localTrabalho,
      setor,
      categoria,
      endereco,
      numero,
      compleEndereco,
      municipio,
      cep,
      uf,
      cargo,
      plano,
      nivel: '',
      padrao: '',
      classe: '',
      grau: '',
      ref,
      cargoComissao: '',
      situacao,
      pis,
      cartProf,
      sf,
      ir,
      lote,
      dataPagamento,
      agencia,
      contaCorrente,
    },
    vantagens,
    descontos,
  }

  return response
}

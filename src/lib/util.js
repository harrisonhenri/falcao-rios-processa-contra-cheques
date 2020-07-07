const fs = require('fs')
const util = require('util')

const fsOpen = util.promisify(fs.open)
const fsWrite = util.promisify(fs.writeFile)
const fsClose = util.promisify(fs.close)

const formatTxt = txt => {
  if (txt.indexOf('AVISO DE CRÉDITO') === -1) {
    const formattedFile = txt.split(
      '*******************************************************************************\n',
    )
    // .reduce(function (acumulator, actual) {
    const piece = formattedFile[0].split(
      '-------------------------------------------------------------------------------',
    )

    const header = piece[0].split('\n').filter(item => {
      return (
        !!item.trim() &&
        item !== 'TXT' &&
        item.indexOf('.tmp') === -1 &&
        item.substr(0, 6) !== 'Página' &&
        item.substr(0, 4) !== 'RESP'
      )
    })

    const date = header[1].trim().split('/')

    const formattedDate = () => {
      switch (date[0]) {
        case 'FEVEREIRO':
          return `28/02/${date[1]}`
        case 'MARCO':
          return `28/03/${date[1]}`
        case 'ABRIL':
          return `28/04/${date[1]}`
        case 'MAIO':
          return `28/05/${date[1]}`
        case 'JUNHO':
          return `28/06/${date[1]}`
        case 'JULHO':
          return `28/07/${date[1]}`
        case 'AGOSTO':
          return `28/08/${date[1]}`
        case 'SETEMBRO':
          return `28/09/${date[1]}`
        case 'OUTUBRO':
          return `28/10/${date[1]}`
        case 'NOVEMBRO':
          return `28/11/${date[1]}`
        case 'DEZEMBRO':
          return `28/12/${date[1]}`
        default:
          return `28/01/${date[1]}`
      }
    }

    const matriculaAdmissaoNomeChora = header[3].split(':')

    const admissao = matriculaAdmissaoNomeChora[2]
      .replace(' C.H', '')
      .replace(/^\d\d\/\d\d\/\d\d\d\d$/g, '')
      .trim()

    const chora = matriculaAdmissaoNomeChora[3].trim()

    const cargo = header[4]
      ? header[4].split(': ')[1].replace('  SIT', '').trim()
      : ''
    const planoNivelPadraoClasseGrauRef = header[5].split('/').filter(item => {
      return (
        item !== 'PL' &&
        item !== 'NV' &&
        item !== 'PD' &&
        item !== 'CL' &&
        item !== 'GR'
      )
    })

    const plano = planoNivelPadraoClasseGrauRef[0].replace('RE: ', '').trim()

    const nivel = planoNivelPadraoClasseGrauRef[1].trim()

    const padrao = planoNivelPadraoClasseGrauRef[2].trim()

    const classe = planoNivelPadraoClasseGrauRef[3].trim()

    const grau = planoNivelPadraoClasseGrauRef[4].trim()

    const ref = planoNivelPadraoClasseGrauRef[5].trim()

    const pisSFIR = header[6].split(':')

    const pis = pisSFIR[1].replace('CPF', '').trim()

    const sf = pisSFIR[4].replace('IR', '').trim()

    const ir = pisSFIR[5].trim()

    const infoBancarias = header[7]
      .split(':')
      .filter(item => {
        return item.trim() !== 'LOTE'
      })
      .filter(item => {
        return item.trim() !== 'BCO'
      })

    const lote = infoBancarias[0].replace('PAG', '').trim()

    const contaCorrente = infoBancarias[2].trim()

    // const main = piece[2]
    //   ? piece[2].split('******').filter(item => {
    //       return !!item.trim()
    //     })
    //   : []

    //   if (main.length >= 1) {
    //     const vencimentos = main[0]
    //       ? main[0].split('\n').filter(item => {
    //           return (
    //             !!item.trim() &&
    //             item !== 'TXT' &&
    //             item.indexOf('.tmp') === -1 &&
    //             item.substr(0, 6) !== 'Página' &&
    //             item.substr(0, 4) !== 'RESP'
    //           )
    //         })
    //       : []

    //     const descontos = main[1]
    //       ? main[1]
    //           .split('\n')
    //           .filter(item => {
    //             return (
    //               !!item.trim() &&
    //               item !== 'TXT' &&
    //               item.indexOf('.tmp') === -1 &&
    //               item.substr(0, 6) !== 'Página' &&
    //               item.substr(0, 4) !== 'RESP'
    //             )
    //           })
    //           .slice(1)
    //       : []

    //     const vencimentosCodRubrica =
    //       vencimentos[0] !== '* TOTAL VENTAGENS ===>'
    //         ? vencimentos.map(item =>
    //             item.replace(/\s{2,}/g, '').replace(/(^\/?\d+)(.+$)/i, '$1'),
    //           )
    //         : []

    //     const vencimentosDescRubrica =
    //       vencimentos[0] !== '* TOTAL VENTAGENS ===>'
    //         ? vencimentos.map(vencimento => {
    //             const name = vencimento
    //               .split(' ')
    //               .filter(
    //                 item =>
    //                   !!item.trim() &&
    //                   item.indexOf(',') === -1 &&
    //                   (item.match(/^(\/?)\d+$/g)
    //                     ? item.match(/^((?!(0))(?!(\/))[0-9]{2,})$/g)
    //                     : true),
    //               )

    //             const nameFull = name[0].match(/^(\/?)\d+$/g)
    //               ? name.slice(1)
    //               : name

    //             return nameFull.length > 1 ? nameFull.join(' ') : nameFull[0]
    //           })
    //         : []

    //     const descontosCodRubrica = descontos.map(item =>
    //       item.replace(/\s{2,}/g, '').replace(/(^\d+\/\d+)(.+$)/i, '$1'),
    //     )

    //     const descontosDescRubrica = descontos.map(desconto => {
    //       const name = desconto
    //         .split(' ')
    //         .filter(item => !!item.trim() && item.match(/[a-zA-Z]/))

    //       const nameFull = name.length > 1 ? name.join(' ') : name[0]

    //       return nameFull
    //     })

    //     const finalGetVencimentosDescontos = parametros => {
    //       const nParametros = parametros.length

    //       switch (nParametros) {
    //         case 3:
    //           return `${parametros[1]};${parametros[0]};${parametros[2]};`
    //         case 2:
    //           if (parametros[0].indexOf(',') === -1) {
    //             return `${'1,000;'}${parametros[0]};${parametros[1]};`
    //           }
    //           return `${parametros[0]};${0};${parametros[1]};`
    //         default:
    //           return `${'1,000;'}${0};${parametros[0]};`
    //       }
    //     }

    //     const dataRubricaFolhaValorTipoVencimentos =
    //       vencimentos[0] !== '* TOTAL VENTAGENS ===>'
    //         ? vencimentos.reduce(function (acumulator, actual, index, array) {
    //             const restoParametros = vencimentos.map(item => {
    //               return item
    //                 .replace(`${vencimentosCodRubrica[index]}`, '')
    //                 .replace(`${vencimentosDescRubrica[index]}`, '')
    //                 .trim()
    //                 .split(' ')
    //                 .filter(item => {
    //                   return !!item.trim()
    //                 })
    //             })
    //             const finalVencimentos = `${finalHeader};${
    //               vencimentosCodRubrica[index]
    //             };${
    //               vencimentosDescRubrica[index]
    //             };${finalGetVencimentosDescontos(restoParametros[index])}R\n`

    //             return acumulator + finalVencimentos
    //           }, '')
    //         : ''

    //     const dataRubricaFolhaValorTipoDescontos = descontos.reduce(function (
    //       acumulator,
    //       actual,
    //       index,
    //       array,
    //     ) {
    //       const restoParametros = descontos.map(item => {
    //         return item
    //           .replace(`${descontosCodRubrica[index]}`, '')
    //           .replace(`${descontosDescRubrica[index]}`, '')
    //           .trim()
    //           .split(' ')
    //           .filter(item => {
    //             return !!item.trim()
    //           })
    //       })

    //       const finalDescontos =
    //         `${finalHeader};${descontosCodRubrica[index]};${
    //           descontosDescRubrica[index]
    //         };${finalGetVencimentosDescontos(restoParametros[index])}D` + `\n`

    //       return acumulator + finalDescontos
    //     },
    //     dataRubricaFolhaValorTipoVencimentos)

    //     if (dataRubricaFolhaValorTipoDescontos !== '') {
    //       return acumulator + dataRubricaFolhaValorTipoDescontos
    //     }
    //     return `${acumulator + finalHeader}\n`
    //   }
    //   return `${acumulator + finalHeader}\n`
    // }
    // return `${acumulator}\n`
    // // }, '')
    const response = {}

    response[formattedDate()] = {
      data: {
        benefeciario: '',
        orgao: '',
        admissao,
        chora,
        unidade: '',
        localTrabalho: '',
        setor: '',
        categoria: '',
        endereco: '',
        numero: '',
        compleEndereco: '',
        municipio: '',
        cep: '',
        uf: 'BA',
        cargo,
        plano,
        nivel,
        padrao,
        classe,
        grau,
        ref,
        cargoComissao: '',
        situacao: '',
        pis,
        cartProf: '',
        sf,
        ir,
        lote,
        dataPagamento: '',
        agencia: '',
        contaCorrente,
        // vantagens,
        // descontos,
      },
    }

    return response
  }

  if (txt.indexOf('SRH- SISTEMA INTEGRADO DE RECURSOS') === -1) {
    const splittedFile = txt.split('\n')

    const date = splittedFile[4].split('/')

    const formattedDate = () => {
      switch (date[0]) {
        case 'Fevereiro':
          return `28/02/${date[1]}`
        case 'Março':
          return `28/03/${date[1]}`
        case 'Abril':
          return `28/04/${date[1]}`
        case 'Maio':
          return `28/05/${date[1]}`
        case 'Junho':
          return `28/06/${date[1]}`
        case 'Julho':
          return `28/07/${date[1]}`
        case 'Agosto':
          return `28/08/${date[1]}`
        case 'Setembro':
          return `28/09/${date[1]}`
        case 'Outubro':
          return `28/10/${date[1]}`
        case 'Novembro':
          return `28/11/${date[1]}`
        case 'Dezembro':
          return `28/12/${date[1]}`
        default:
          return `28/01/${date[1]}`
      }
    }

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

    const vantagensDescontosStart =
      splittedFile.indexOf('VANTAGENSDESCONTOS') + 2

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
          folha: 0,
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
          folha: 0,
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
          folha: 0,
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
          folha: 0,
          valor: valorVantagemCodigoDesconto[0].trim(),
          tipo: 'D',
        })
      }
    }

    const response = {}

    response[formattedDate()] = {
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
        vantagens,
        descontos,
      },
    }

    return response
  }

  if (txt.indexOf('SRH- SISTEMA INTEGRADO DE RECURSOS') !== -1) {
    const splittedFile = txt.split('\n')
    console.log(splittedFile.slice(3))

    const date = splittedFile[7].split('/')

    const formattedDate = () => {
      switch (date[0]) {
        case 'Fevereiro':
          return `28/02/${date[1]}`
        case 'Março':
          return `28/03/${date[1]}`
        case 'Abril':
          return `28/04/${date[1]}`
        case 'Maio':
          return `28/05/${date[1]}`
        case 'Junho':
          return `28/06/${date[1]}`
        case 'Julho':
          return `28/07/${date[1]}`
        case 'Agosto':
          return `28/08/${date[1]}`
        case 'Setembro':
          return `28/09/${date[1]}`
        case 'Outubro':
          return `28/10/${date[1]}`
        case 'Novembro':
          return `28/11/${date[1]}`
        case 'Dezembro':
          return `28/12/${date[1]}`
        default:
          return `28/01/${date[1]}`
      }
    }

    const orgao = splittedFile[11]

    const benefeciario = splittedFile[13]

    const admissao = splittedFile[17]

    const chora = splittedFile[19]

    const unidade = splittedFile[21]

    const localTrabalho = splittedFile[23]

    const setor = splittedFile[25]

    const categoria = splittedFile[25]

    const endereco = splittedFile[27]

    const numero = splittedFile[29]

    const compleEndereco = splittedFile[31]

    const municipio = splittedFile[33]

    const cep = splittedFile[35]

    const uf = splittedFile[37]

    const cargo = splittedFile[39]

    const plano = splittedFile[41]

    const nivel = splittedFile[39]

    const padrao = splittedFile[37]

    const classe = splittedFile[39]

    // const grau = ''

    // const ref = splittedFile[41]

    // const cargoComissao = splittedFile[39]

    // const situacao = splittedFile[39]

    // const pis = splittedFile[39]

    // const cartProf = splittedFile[39]

    // const sf = splittedFile[39]

    // const ir = splittedFile[39]

    // const lote = splittedFile[39]

    // const dataPagamento = splittedFile[39]

    // const agencia = splittedFile[39]

    // const contaCorrente = splittedFile[39]

    // const vinculoId = splittedFile[39]

    // const tipoFolha = splittedFile[39]

    // const pathInBotServer = splittedFile[39]

    const response = {}

    response[formattedDate()] = {
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
        nivel,
        padrao,
        classe,
      },
    }

    return response
  }
  return ''
}

module.exports = function writeFile(fileName, textfile) {
  // const fileDescriptor = await fsOpen(fileName, 'wx')

  // await fsWrite(fileDescriptor, formatTxt(textfile.text))

  // await fsClose(fileDescriptor)

  return formatTxt(textfile.text)
}

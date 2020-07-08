const formatDate = require('./formatDate')

module.exports = function formatFichas(ficha) {
  const response = {}

  const formattedFile = ficha.split(
    '*******************************************************************************\n',
  )

  for (let index = 0; index < formattedFile.length; index += 1) {
    const splittedFile = formattedFile[index].split(
      '-------------------------------------------------------------------------------',
    )

    const header = splittedFile[0].split('\n').filter(item => {
      return (
        !!item.trim() &&
        item !== 'TXT' &&
        item.indexOf('.tmp') === -1 &&
        item.substr(0, 6) !== 'Página' &&
        item.substr(0, 4) !== 'RESP'
      )
    })

    if (header.length > 1) {
      const date = header[1] ? header[1].trim().split('/') : ''

      const matriculaAdmissaoNomeChora = header[3] && header[3].split(':')

      const admissao = matriculaAdmissaoNomeChora
        ? matriculaAdmissaoNomeChora[2]
            .replace(' C.H', '')
            .replace(/^\d\d\/\d\d\/\d\d\d\d$/g, '')
            .trim()
        : ''

      const chora = matriculaAdmissaoNomeChora
        ? matriculaAdmissaoNomeChora[3].trim()
        : ''

      const cargo = header[4]
        ? header[4].split(': ')[1].replace('  SIT', '').trim()
        : ''
      const planoNivelPadraoClasseGrauRef =
        header[5] &&
        header[5].split('/').filter(item => {
          return (
            item !== 'PL' &&
            item !== 'NV' &&
            item !== 'PD' &&
            item !== 'CL' &&
            item !== 'GR'
          )
        })

      const plano =
        planoNivelPadraoClasseGrauRef &&
        planoNivelPadraoClasseGrauRef[0].replace('RE: ', '').trim()

      const nivel =
        planoNivelPadraoClasseGrauRef && planoNivelPadraoClasseGrauRef[1].trim()

      const padrao =
        planoNivelPadraoClasseGrauRef && planoNivelPadraoClasseGrauRef[2].trim()

      const classe =
        planoNivelPadraoClasseGrauRef && planoNivelPadraoClasseGrauRef[3].trim()

      const grau =
        planoNivelPadraoClasseGrauRef && planoNivelPadraoClasseGrauRef[4].trim()

      const ref =
        planoNivelPadraoClasseGrauRef && planoNivelPadraoClasseGrauRef[5].trim()

      const pisSFIR = header[6] && header[6].split(':')

      const pis = pisSFIR && pisSFIR[1].replace('CPF', '').trim()

      const sf = pisSFIR && pisSFIR[4].replace('IR', '').trim()

      const ir = pisSFIR && pisSFIR[5].trim()

      const infoBancarias =
        header[7] &&
        header[7]
          .split(':')
          .filter(item => {
            return item.trim() !== 'LOTE'
          })
          .filter(item => {
            return item.trim() !== 'BCO'
          })

      const lote = infoBancarias
        ? infoBancarias[0].replace('PAG', '').trim()
        : ''

      const contaCorrente = infoBancarias ? infoBancarias[2].trim() : ''

      const main = splittedFile[2]
        ? splittedFile[2].split('******').filter(item => {
            return !!item.trim()
          })
        : []

      const vantagens = []

      const descontos = []

      if (main.length >= 1) {
        const finalGetVantagensDescontos = parametros => {
          switch (parametros.length) {
            case 3:
              return [parametros[1], parametros[0], parametros[2]]
            case 2:
              if (parametros[0].indexOf(',') === -1) {
                return ['1,000', parametros[0], parametros[1]]
              }
              return [parametros[0], '0', parametros[1]]
            default:
              return ['1,000', '0', parametros[0]]
          }
        }

        const vantagensAux = main[0]
          ? main[0].split('\n').filter(item => {
              return (
                !!item.trim() &&
                item !== 'TXT' &&
                item.indexOf('.tmp') === -1 &&
                item.substr(0, 6) !== 'Página' &&
                item.substr(0, 4) !== 'RESP'
              )
            })
          : []

        const descontosAux = main[1]
          ? main[1]
              .split('\n')
              .filter(item => {
                return (
                  !!item.trim() &&
                  item !== 'TXT' &&
                  item.indexOf('.tmp') === -1 &&
                  item.substr(0, 6) !== 'Página' &&
                  item.substr(0, 4) !== 'RESP'
                )
              })
              .slice(1)
          : []

        const vantagensCodRubrica =
          vantagensAux[0] !== '* TOTAL VENTAGENS ===>'
            ? vantagensAux.map(item =>
                item.replace(/\s{2,}/g, '').replace(/(^\/?\d+)(.+$)/i, '$1'),
              )
            : []

        const vantagensDescRubrica =
          vantagensAux[0] !== '* TOTAL VENTAGENS ===>'
            ? vantagensAux.map(vencimento => {
                const name = vencimento
                  .split(' ')
                  .filter(
                    item =>
                      !!item.trim() &&
                      item.indexOf(',') === -1 &&
                      (item.match(/^(\/?)\d+$/g)
                        ? item.match(/^((?!(0))(?!(\/))[0-9]{2,})$/g)
                        : true),
                  )
                const nameFull =
                  name[0].match(/^(\/?)\d+$/g) && name[0] !== '13'
                    ? name.slice(1)
                    : name

                return nameFull.length > 1 ? nameFull.join(' ') : nameFull[0]
              })
            : []

        const dataRubricaFolhaValorTipoVantagens =
          vantagensAux[0] !== '* TOTAL VENTAGENS ===>'
            ? vantagensAux.map((vantagem, vantagemIndex) => {
                return vantagem
                  .replace(`${vantagensCodRubrica[vantagemIndex]}`, '')
                  .replace(`${vantagensDescRubrica[vantagemIndex]}`, '')
                  .trim()
                  .split(' ')
                  .filter(item => {
                    return !!item.trim()
                  })
              })
            : []

        for (let i = 0; i < vantagensCodRubrica.length; i += 1) {
          const [percentual, folha, valor] = finalGetVantagensDescontos(
            dataRubricaFolhaValorTipoVantagens[i],
          )

          vantagens.push({
            codigo: vantagensCodRubrica[i],
            discriminacao: vantagensDescRubrica[i],
            percentual,
            folha,
            valor,
            tipo: 'R',
          })
        }

        const descontosCodRubrica = descontosAux.map(item =>
          item.replace(/\s{2,}/g, '').replace(/(^\d+\/\d+)(.+$)/i, '$1'),
        )

        const descontosDescRubrica = descontosAux.map(desconto => {
          const name = desconto
            .split(' ')
            .filter(item => !!item.trim() && item.match(/[a-zA-Z]/))
          const nameFull = name.length > 1 ? name.join(' ') : name[0]
          return nameFull
        })

        const dataRubricaFolhaValorTipoDescontos = descontosAux.map(
          (desconto, descontoIndex) => {
            return desconto
              .replace(`${descontosCodRubrica[descontoIndex]}`, '')
              .replace(`${descontosDescRubrica[descontoIndex]}`, '')
              .trim()
              .split(' ')
              .filter(item => {
                return !!item.trim()
              })
          },
        )

        for (let j = 0; j < descontosCodRubrica.length; j += 1) {
          const [percentual, folha, valor] = finalGetVantagensDescontos(
            dataRubricaFolhaValorTipoDescontos[j],
          )

          descontos.push({
            codigo: descontosCodRubrica[j],
            discriminacao: descontosDescRubrica[j],
            percentual,
            folha,
            valor,
            tipo: 'D',
          })
        }
      }

      response[formatDate(date)] = {
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
          vantagens,
          descontos,
        },
      }
    }
  }

  return response
}

module.exports = function formatDate(date) {
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

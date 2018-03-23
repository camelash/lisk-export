const lisk = require('lisk-js')
const json2csv = require('json2csv').parse
const { send } = require('micro')
const { router, get } = require('microrouter')

module.exports = router(
  get('/:address', async (req, res) => {
    const { address } = req.params
    const { limit = 200, delimiter = ';' } = req.query
    if (address.includes('favicon')) return ''

    return new Promise((resolve, reject) => {
      lisk.api().listTransactions(address, limit, 0, data => {
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=lisk_transactions_${address}.csv`
        )
        try {
          const csv = json2csv(data.transactions, {
            delimiter
          })
          resolve(csv)
        } catch (err) {
          console.error(err)
          reject('Something went wrong')
        }
      })
    })
  })
)

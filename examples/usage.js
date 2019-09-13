'use strict'

process.env.DEBUG = '*'

const debug = require('debug')('bfx:api:plugins:managed-ob-cs:example')
const { Manager, subscribe } = require('bfx-api-node-core')
const ManagedOBChecksumPlugin = require('../')

const SYMBOL = 'tBTCUSD'
const mgr = new Manager({
  transform: true,
  plugins: [ManagedOBChecksumPlugin()]
})

mgr.onWS('open', {}, () => debug('connection open'))

// Catch checksum errors
mgr.onWS('ws2:error', {}, (err) => {
  if (err.message.match(/ob checksum/)) {
    debug('recv ob checksum error: %s', err.message)
  }
})

const wsState = mgr.openWS()

subscribe(wsState, 'book', {
  symbol: SYMBOL,
  len: '25',
  prec: 'P0'
})

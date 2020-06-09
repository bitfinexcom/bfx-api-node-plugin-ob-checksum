'use strict'

const { definePlugin } = require('bfx-api-node-core')

const onOpenWS = require('./ws/open')
const onBookData = require('./data/book')
const onBookCSData = require('./data/bookCS')

const Plugin = definePlugin('bfx.ob-cs', {}, (h = {}, args = {}) => ({
  type: 'ws2',
  ws: {
    open: onOpenWS(h, args)
  },

  data: {
    book: onBookData(h, args),
    bookCS: onBookCSData(h, args)
  }
}))

module.exports = Plugin

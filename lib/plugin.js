'use strict'

const { definePlugin } = require('bfx-api-node-core')

const onOpenWS = require('./ws/open')
const onBookData = require('./data/book')
const onBookCSData = require('./data/bookCS')

/**
 * Maintains a locally managed OB collection and validates it against incoming
 * checksums. Automatically enables checksums when ws2 clients connect.
 *
 * @function
 * @exports module:bfx-api-node-plugin-ob-checksum
 *
 * @returns {module:bfx-api-node-core.Plugin} pluginState
 */
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

'use strict'

const debug = require('debug')('bfx:api:plugins:ob-cs:data:book-cs')
const dataKey = require('../util/ob_data_key')

/**
 * Emits an error via the socket's ev if the received checksum doesn't match
 *
 * @memberof module:bfx-api-node-plugin-ob-checksum
 * @private
 *
 * @param {module:bfx-api-node-core.PluginHelpers} h - helpers
 * @param {object} args - plugin arguments
 * @returns {module:bfx-api-node-core.PluginEventHandler} func
 */
const onBookCSData = (h = {}, args = {}) => ({ state = {}, data = {} } = {}) => {
  const { ev, books = {} } = state
  const { chanFilter = {} } = data
  const cs = data.original
  const key = dataKey(chanFilter)

  if (!books[key]) {
    return null
  }

  const localCS = books[key].checksum()

  if (localCS !== cs) {
    const err = new Error(
      `ob checksum mismatch for ${key}: local ${localCS} !== ${cs}`
    )

    ev.emit('error', err)
    debug(err.message)
  } else {
    debug('cs ok [%d]', cs)
  }

  return null
}

module.exports = onBookCSData

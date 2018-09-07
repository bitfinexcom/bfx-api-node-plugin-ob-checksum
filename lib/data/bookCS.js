'use strict'

const debug = require('debug')('bfx:api:plugins:ob-cs:data:book-cs')
const dataKey = require('../util/ob_data_key')

/**
 * Emits an error via the socket's ev if the received checksum doesn't match
 *
 * @param {Object} args
 * @param {Object} args.state
 * @param {Object} args.data
 * @return {null} nextState
 */
module.exports = (h = {}, args = {}) => ({ state = {}, data = {} } = {}) => {
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

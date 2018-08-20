'use strict'

const debug = require('debug')('bfx:api:plugins:ob-cs')
const { OrderBook } = require('bfx-api-node-models')
const { Config, enableFlag } = require('bfx-api-node-core')
const dataKey = require('./util/ob_data_key')

/**
 * Maintains a locally managed OB collection and validates it against incoming
 * checksums. Automatically enables checksums when ws2 clients connect.
 */
module.exports = {
  type: 'ws2',

  ws: {
    open: ({ state = {} } = {}) => {
      debug('enabling OB CS flag')

      return enableFlag(state, Config.FLAGS.OB_CHECKSUM)
    }
  },

  data: {

    /**
     * Maintains an internal collection of OBs on state.books, for later
     * checksum verification.
     *
     * @param {Object} args
     * @param {Object} args.state
     * @param {Object} args.data
     * @return {Object} nextState - contains updated books
     */
    book: ({ state = {}, data = {} } = {}) => {
      const { chanFilter = {}, original = [] } = data
      const { books = {} } = state
      const key = dataKey(chanFilter)
      const raw = chanFilter.prec[0] === 'R'
      const nextBook = books[key]
        ? books[key]
        : new OrderBook(original, raw)

      if (books[key]) {
        nextBook.updateWith(original)
      }

      return {
        ...state,
        books: {
          ...books,
          [key]: nextBook,
        }
      }
    },

    /**
     * Emits an error via the socket's ev if the received checksum doesn't match
     *
     * @param {Object} args
     * @param {Object} args.state
     * @param {Object} args.data
     * @return {null} nextState
     */
    bookCS: ({ state = {}, data = {} } = {}) => {
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
  }
}


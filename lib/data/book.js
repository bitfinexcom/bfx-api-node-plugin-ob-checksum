'use strict'

const { OrderBook } = require('bfx-api-node-models')
const dataKey = require('../util/ob_data_key')

/**
 * Maintains an internal collection of OBs on state.books, for later
 * checksum verification.
 *
 * @private
 *
 * @returns {bfx-api-node-core.PluginEventHandler} func
 */
const onBookData = () => ({ state = {}, data = {} } = {}) => {
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
      [key]: nextBook
    }
  }
}

module.exports = onBookData

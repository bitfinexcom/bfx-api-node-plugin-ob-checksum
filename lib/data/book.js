'use strict'

const { OrderBook } = require('bfx-api-node-models')
const dataKey = require('../util/ob_data_key')

/**
 * Maintains an internal collection of OBs on state.books, for later
 * checksum verification.
 *
 * @param {Object} args
 * @param {Object} args.state
 * @param {Object} args.data
 * @return {Object} nextState - contains updated books
 */
module.exports = (h = {}, args = {}) => ({ state = {}, data = {} } = {}) => {
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
}

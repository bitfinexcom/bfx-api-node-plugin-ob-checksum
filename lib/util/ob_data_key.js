'use strict'

/**
 * @memberof module:bfx-api-node-plugin-ob-checksum
 * @private
 *
 * @param {module:bitfinex-api-node.OrderBookChannel} channel - channel
 * @returns {string} key
 */
const obDataKey = (channel) => {
  const { symbol, freq, prec, len } = channel
  return [symbol, freq, prec, len].map(String).join(':')
}

module.exports = obDataKey

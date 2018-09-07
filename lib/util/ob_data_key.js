'use strict'

module.exports = (channel) => {
  const { symbol, freq, prec, len } = channel
  return [symbol, freq, prec, len].map(String).join(':')
}
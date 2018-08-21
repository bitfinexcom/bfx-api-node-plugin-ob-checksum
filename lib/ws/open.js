'use strict'

const debug = require('debug')('bfx:api:plugins:ob-cs:ws:open')
const { Config, enableFlag } = require('bfx-api-node-core')

module.exports = (h = {}, args = {}) => ({ state = {} } = {}) => {
  debug('enabling OB CS flag')

  return enableFlag(state, Config.FLAGS.OB_CHECKSUM)
}

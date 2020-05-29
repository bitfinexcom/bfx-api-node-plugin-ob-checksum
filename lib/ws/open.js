'use strict'

const debug = require('debug')('bfx:api:plugins:ob-cs:ws:open')
const { Config, enableFlag } = require('bfx-api-node-core')

/**
 * @memberof module:bfx-api-node-plugin-ob-checksum
 * @private
 *
 * @returns {module:bfx-api-node-core.PluginEventHandler} func
 */
const onOpenWS = () => ({ state = {} } = {}) => {
  debug('enabling OB CS flag')

  return enableFlag(state, Config.FLAGS.OB_CHECKSUM)
}

module.exports = onOpenWS

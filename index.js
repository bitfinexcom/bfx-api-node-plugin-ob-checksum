'use strict'

/**
 * This module enables the
 * {@link module:bfx-api-node-models.OrderBook|Order Book} checksum flag upon
 * connecting, and maintains internal
 * {@link module:bfx-api-node-models.OrderBook|Order Book} model instances for
 * all subscribed book channels. Upon receiving a checksum from the server, the
 * relevant internal model is audited and an `error` event is emitted on
 * checksum miss-match. Valid checksums are reported in debug output.
 *
 * Note that the {@link module:bfx-api-node-core.Manager|Manager} proxies the
 * event as `ws2:error`. If subscribing on a socket instance
 * (`wsState.ev.on(...)`) use the internal event name, otherwise use the
 * manager name with `manager.onWS(...)`.
 *
 * ### Features
 *
 * * Maintains up-to-date internal
 *   {@link module:bfx-api-node-models.OrderBook|Order Book} model instances
 * * Verfies managed {@link module:bfx-api-node-models.OrderBook|Order Book}
 *   checksums with each incoming remote checksum packet
 * * Emits a `ws2:error` event on checksum miss-match
 *
 * ### Installation
 *
 * ```bash
 * npm i --save bfx-api-node-plugin-ob-checksum
 * ```
 *
 * ### Quickstart & Example
 *
 * ```js
 * const debug = require('debug')('bfx:api:plugins:managed-ob-cs:example')
 * const { Manager, subscribe } = require('bfx-api-node-core')
 * const ManagedOBChecksumPlugin = require('../')
 *
 * const SYMBOL = 'tBTCUSD'
 * const mgr = new Manager({
 *   transform: true,
 *   plugins: [ManagedOBChecksumPlugin()]
 * })
 *
 * mgr.onWS('open', {}, () => debug('connection open'))
 *
 * // Catch checksum errors
 * mgr.onWS('ws2:error', {}, (err) => {
 *   if (err.message.match(/ob checksum/)) {
 *     debug('recv ob checksum error: %s', err.message)
 *   }
 * })
 *
 * const wsState = mgr.openWS()
 *
 * subscribe(wsState, 'book', {
 *   symbol: SYMBOL,
 *   len: '25',
 *   prec: 'P0'
 * })
 * ```
 *
 * @license MIT
 * @module bfx-api-node-plugin-ob-checksum
 */

module.exports = require('./lib/plugin')

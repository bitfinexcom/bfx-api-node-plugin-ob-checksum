<a name="bfx-api-node-plugin-ob-checksum"></a>

## bfx-api-node-plugin-ob-checksum() ⇒ <code>bfx-api-node-core.Plugin</code>
This module enables the `OrderBook` checksum flag upon connecting, and
maintains internal `OrderBook` model instances for all subscribed book
channels. Upon receiving a checksum from the server, the relevant internal
model is audited and an `error` event is emitted on checksum miss-match.
Valid checksums are reported in debug output.

Note that the `Manager` proxies the event as `ws2:error`. If subscribing on
a socket instance (`wsState.ev.on(...)`) use the internal event name,
otherwise use the manager name with `manager.onWS(...)`.

**Kind**: global function  
**Returns**: <code>bfx-api-node-core.Plugin</code> - pluginState  
**License**: MIT  
**Example**  
```js
const debug = require('debug')('bfx:api:plugins:managed-ob-cs:example')
const { Manager, subscribe } = require('bfx-api-node-core')
const ManagedOBChecksumPlugin = require('bfx-api-node-plugin-ob-checksum')

const SYMBOL = 'tBTCUSD'
const mgr = new Manager({
  transform: true,
  plugins: [ManagedOBChecksumPlugin()]
})

mgr.onWS('open', {}, () => debug('connection open'))

// Catch checksum errors
mgr.onWS('ws2:error', {}, (err) => {
  if (err.message.match(/ob checksum/)) {
    debug('recv ob checksum error: %s', err.message)
  }
})

const wsState = mgr.openWS()

subscribe(wsState, 'book', {
  symbol: SYMBOL,
  len: '25',
  prec: 'P0'
})
```

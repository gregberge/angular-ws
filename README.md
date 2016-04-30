# angular-ws

# This plugin is no longer actively maintained, you can still use it but issues will not be resolved. If you want the npm name, you can contact me by email.

[![Build Status](https://travis-ci.org/neoziro/angular-ws.svg?branch=master)](https://travis-ci.org/neoziro/angular-ws)
[![Dependency Status](https://david-dm.org/neoziro/angular-ws.svg?theme=shields.io)](https://david-dm.org/neoziro/angular-ws)
[![devDependency Status](https://david-dm.org/neoziro/angular-ws/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/angular-ws#info=devDependencies)

WebSocket service for Angular.js.

## Install

```
bower install angular-ws
```

## Usage

```js
angular.module('app', ['ws'])
.config(function (wsProvider) {
  wsProvider.setUrl('ws://echo.websocket.org');
})
.controller('WebSocketCtrl', function ($scope, ws, $log) {
  ws.on('message', function (event) {
    $log.info('New message', event.data);
  });

  ws.send('custom message');
});
```

### Provider

#### wsProvider.setUrl(url)

Set the url of the WebSocket.

```js
wsProvider.setUrl('ws://echo.websocket.org');
```

#### wsProvider.setProtocols(protocols)

Set the protocols used by the WebSocket.

```js
wsProvider.setProtocols(['protocol']);
```

#### wsProvider.setTransport(transport)

Set a custom transport (example: [ReconnectingWebSocket](https://github.com/joewalnes/reconnecting-websocket)).

```js
wsProvider.setTransport(ReconnectingWebSocket);
```

### Service

#### ws.connect([config])

Connect the WebSocket, you can provide a custom config.

Note that if you use `ws.on` or `ws.send` the connection is automatic.

```js
ws.connect({
  url: 'ws://echo.websocket.org',
  protocols: ['protocol']
})
.then(function () {
  $log.debug('WebSocket is connected.');
}, function () {
  $log.debug('An error occurs during WebSocket connection.');
});
```

#### ws.baseSocket

The base socket object.

```js
ws.baseSocket.onmessage = function (event) {
  // event.data ...
}
```

#### ws.getReadyState()

Get the ready state of the WebSocket.

```js
ws.getReadyState() // WebSocket.CLOSED, WebSocket.OPEN...
```

#### ws.on(event, listener)

Listen an event on the WebSocket, the function is already wrapped in `$rootScope.$apply()`.

```js
ws.on('message', function (event) {
  $log.info('New message', event.data);
});
```

#### ws.close()

Close the connection of the WebSocket.

```js
ws.close();
```

## Testing

To be able to test WebSocket in the good way, the module [angular-ws-mock](https://github.com/neoziro/angular-ws-mock) will provide you a transparent mock.

## License

MIT

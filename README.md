# angular-ws
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
  wsProvider.setUrl('url', 'ws://echo.websocket.org');
})
.controller('WebSocketCtrl', function ($scope, ws) {
  ws.on('message', function (msg) {
    // ...
  });

  ws.send('custom message');
});
```

### Interceptors

```js
angular.module('app', ['ws'])
.config(function (wsProvider) {
  wsProvider.interceptors.push('wsInterceptor');
})
.factory('wsInterceptor', function ($window) {
  return {
    request: function (config) {
      if ($window.sessionStorage.token)
        config.url = 'ws://echo.websocket.org?token=' + $window.sessionStorage.token;
      return config;
    }
  };
});
```

## License

MIT
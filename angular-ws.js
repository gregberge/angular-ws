/*! Angular ws v1.1.0 | (c) 2014 Greg Bergé | License MIT */

angular
.module('ws', [])
.provider('ws', wsProvider);

function wsProvider() {
  var provider = this;

  /**
   * Configuration.
   */

  this.config = {
    transport: WebSocket
  };

  /**
   * Expose ws service.
   */

  this.$get = ['$rootScope', '$q', wsService];

  /**
   * Create a new Primus service.
   */

  function wsService($rootScope, $q) {

    var ws = {};

    ws._buffer = [];

    /**
     * Connect the WebSocket.
     *
     * @param {object} config
     */

    ws.connect = function (config) {
      config = config || {};
      var defer = $q.defer();

      if (config.url) provider.config.url = config.url;
      if (config.protocols) provider.config.protocols = config.protocols;
      if (config.transport) provider.config.transport = config.transport;

      if (provider.config.protocols)
        ws.baseSocket = new provider.config.transport(
          provider.config.url,
          provider.config.protocols
        );
      else
        ws.baseSocket = new provider.config.transport(provider.config.url);

      ws.on('open', function () {
        // Send buffered messages.
        ws._buffer.forEach(ws.send);
        ws._buffer = [];

        defer.resolve(ws);
      });

      ws.on('error', function (err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    /**
     * Return the ready state of the WebSocket.
     *
     * @returns {string}
     */

    ws.getReadyState = function () {
      if (!ws.baseSocket) return null;
      return ws.baseSocket.readyState;
    };

    /**
     * Listen on events of a given type.
     * This event make an $rootScope.$apply on the listener.
     *
     * @param {String} event
     * @param {Function} listener
     * @returns {Function} Deregistration function for this listener.
     */

    ws.on = function (event, listener) {
      if (!ws.baseSocket) ws.connect();

      // Wrap primus event with $rootScope.$apply.
      ws.baseSocket.addEventListener(event, applyListener);

      function applyListener() {
        var args = arguments;
        $rootScope.$apply(function () {
          listener.apply(null, args);
        });
      }

      // Return the deregistration function
      return function $off() {
        ws.baseSocket.removeEventListener(event, applyListener);
      };
    };

    /**
     * Send a message threw the socket.
     *
     * @param {string} msg
     */

    ws.send = function (msg) {
      if (!ws.baseSocket) ws.connect();

      if (!ws.baseSocket || ws.baseSocket.readyState !== ws.baseSocket.OPEN)
        return ws._buffer.push(msg);

      ws.baseSocket.send(msg);
    };

    /**
     * Close the WebSocket.
     */

    ws.close = function () {
      if (!ws.baseSocket) return;
      ws.baseSocket.close.apply(ws.baseSocket, arguments);
    };

    return ws;
  }

  /**
   * Define URL.
   *
   * @param {string} url
   * @returns {primusProvider}
   */

  this.setUrl = function setOptions(url) {
    this.config.url = url;
    return this;
  };

  /**
   * Define protocols.
   *
   * @param {*} protocols
   * @returns {primusProvider}
   */

  this.setProtocols = function setEndpoint(protocols) {
    this.config.protocols = protocols;
    return this;
  };

  /**
   * Set a custom WebSocket transport.
   *
   * @param {*} transport
   * @returns {primusProvider}
   */

  this.setTransport = function setTransport(transport) {
    this.config.transport = transport;
    return this;
  };
}
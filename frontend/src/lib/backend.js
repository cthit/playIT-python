function get_cookie() {
  var re = /(?:(?:^|.*;\s*)chalmersItAuth\s*\=\s*([^;]*).*$)|^.*$/;
  return document.cookie.replace(re, "$1");
}

export default class Backend {
  constructor(url) {
    this.url = url;
    this.listeners = {};
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);
      this.socket.onmessage = this._messageReceived.bind(this);
      this.socket.onclose = this._socketClosed.bind(this);
      this.socket.onopen = resolve;
    });
  }
  normalizeEventName(name) {
    return name.toLowerCase();
  }
  _serverLog(topic, args) {
    this._log('SERVER', topic, args);
  }
  _log(entity, topic, args) {
    if (args && Object.keys(args).length > 0) {
      console.log('[%s] %s:', entity, topic, args);
    } else {
      console.log('[%s] %s', entity, topic);
    }
  }
  _clientLog(topic, args) {
    this._log('CLIENT', topic, args);
  }
  registerListener(event, callback) {
    event = this.normalizeEventName(event);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  removeListener(event, callback) {
    event = this.normalizeEventName(event);
    this.listeners[event] = this.listeners[event].filter((a) => a !== callback);
  }
  _notifyListeners(topic, args) {
    topic = event = this.normalizeEventName(topic);;
    if (this.listeners[topic] && this.listeners[topic].length > 0) {
      this.listeners[topic].forEach((func) => func(args));
    }
  }
  call(method, args = {}) {
    args.token = get_cookie();
    this._clientLog(method, args);
    let data = [method, JSON.stringify(args)].join(' ');
    this.socket.send(data);
  }
  _parseResponse(data) {
    let i = data.indexOf(' ');
    return [
      data.slice(0, i).toLowerCase(),
      JSON.parse(data.slice(i + 1))
    ];
  }
  _messageReceived(event) {
    let [topic, args] = this._parseResponse(event.data);
    this._serverLog(topic, args);
    this._notifyListeners(topic, args);
  }
  _socketClosed(data) {
    this._serverLog('CLOSED, reason', data.reason);
  }
}

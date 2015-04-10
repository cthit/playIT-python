function get_cookie() {
  var re = /(?:(?:^|.*;\s*)chalmersItAuth\s*\=\s*([^;]*).*$)|^.*$/;
  return document.cookie.replace(re, "$1");
}

export default class Backend {
  constructor(url, callback) {
    this.url = url;
    this.listeners = {};

    this.socket = new WebSocket(this.url);
    this.socket.onmessage = this._messageReceived.bind(this);
    this.socket.onclose = this._socketClosed.bind(this);
    this.socket.onopen = callback;
  }
  registerListener(event, callback) {
    event = event.toLowerCase();
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  removeListener(event, callback) {
    event = event.toLowerCase();
    this.listeners[event] = this.listeners[event].filter((a) => a !== callback);
  }
  _notifyListeners(topic, args) {
    topic = topic.toLowerCase();
    if (this.listeners[topic] && this.listeners[topic].length > 0) {
      this.listeners[topic].map((func) => {
        func(args);
      });
    }
  }
  call(method, args = {}) {
    args.token = get_cookie();
    let data = method + ' ' + JSON.stringify(args);
    this.socket.send(data);
  }
  _messageReceived(event) {
    let data = event.data;
    let i = data.indexOf(' ');
    let [topic, args] = [data.slice(0, i).toLowerCase(), JSON.parse(data.slice(i + 1))];
    console.log('%s, args: %o', topic, args);
    this._notifyListeners(topic, args);
  }
  _socketClosed(data) {
    console.log(data);
  }
}

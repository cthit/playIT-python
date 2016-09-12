import { cookieName } from '../config';

import transformTopicToAction from './topicToActionTransformer';

function get_cookie() {
  var re = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*\\=\\s*([^;]*).*$)|^.*$")
  return document.cookie.replace(re, "$1");
}

class Backend {
  connect(url, dispatch, onDisconnect) {
    this.url = url
    this.dispatch = dispatch
    this.onDisconnect = onDisconnect
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);
      this.socket.onmessage = this._messageReceived.bind(this);
      this.socket.onclose = this._socketClosed.bind(this);
      this.socket.onopen = () => resolve(this);
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
  _dispatchAction(topic, args) {
    topic = this.normalizeEventName(topic);
    const action = transformTopicToAction(topic, args);

    if (action) {
      this.dispatch(action);
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
    this._dispatchAction(topic, args);
  }
  _socketClosed(data) {
    this._serverLog('CLOSED, reason', data.reason);
    this.onDisconnect(data.reason);
  }
}

export default new Backend()

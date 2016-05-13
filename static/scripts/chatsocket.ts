interface onUserJoinCallback {
  id: string,
  f: (username: string) => void
}

interface onUserLeaveCallback {
  id: string,
  f: (username: string) => void
}

interface onNewMessageCallback {
  id: string,
  f: (username, message: string) => void
}

class ChatSocket {
  private websocketUrl: string;
  private socket: WebSocket;
  private onUserJoinCallbacks: onUserJoinCallback[];
  private onUserLeaveCallbacks: onUserLeaveCallback[];
  private onNewMessageCallbacks: onNewMessageCallback[];

  constructor(websocketUrl: string) {
    this.websocketUrl = websocketUrl;

    this.onUserJoinCallbacks = [];
    this.onUserLeaveCallbacks = [];
    this.onNewMessageCallbacks = [];
  }

  public connect() {
    this.socket = new WebSocket(this.websocketUrl);

    this.socket.onopen = (event) => this.onOpen(event);
    this.socket.onerror = (event) => this.onError(event);
    this.socket.onmessage = (event) => this.onMessage(event);
    this.socket.onclose = (event) => this.onClose(event);
  }

  public disconnect() {
    this.onUserJoinCallbacks = [];
    this.onUserLeaveCallbacks = [];
    this.onNewMessageCallbacks = [];

    this.socket.close();
  }

  public send(message: string) {
    this.socket.send(message);
  }

  private onOpen(event) {
    console.log('onOpen', event);
  }

  private onError(event) {
    console.log('onError', event);
  }

  private onMessage(event: MessageEvent) {
    let json = JSON.parse(event.data);

    if (json.type === 'join') {
      for (let callback of this.onUserJoinCallbacks) {
        callback.f(json.data);
      }
    } else if (json.type === 'leave') {
      for (let callback of this.onUserLeaveCallbacks) {
        callback.f(json.data);
      }
    } else if (json.type === 'message') {
      console.log('json.type === message', json.data);
    }
  }

  private onClose(event : CloseEvent) {
    console.log('onClose', event);
  }

  //
  // Callbacks
  //
  public addOnUserJoinCallback(callback: onUserJoinCallback) {
    this.onUserJoinCallbacks.push(callback);
  }

  public removeOnUserJoinCallback(id: string) {
    let length = this.onUserJoinCallbacks.length;
    this.onUserJoinCallbacks = this.onUserJoinCallbacks.filter(cb => cb.id !== id);
    return length - this.onUserJoinCallbacks.length;
  }

  public addOnUserLeaveCallback(callback: onUserJoinCallback) {
    this.onUserLeaveCallbacks.push(callback);
  }

  public removeOnUserLeaveCallback(id: string) : number {
    let length = this.onUserLeaveCallbacks.length;
    this.onUserLeaveCallbacks = this.onUserLeaveCallbacks.filter(cb => cb.id !== id);
    return length - this.onUserLeaveCallbacks.length;
  }

  public addOnNewMessageCallback(callback: onNewMessageCallback) {
    this.onNewMessageCallbacks.push(callback);
  }

  public removeOnNewMessageCallback(id: string) : number {
    let length = this.onNewMessageCallbacks.length;
    this.onNewMessageCallbacks = this.onNewMessageCallbacks.filter(cb => cb.id !== id);
    return length - this.onNewMessageCallbacks.length;
  }
}

export default ChatSocket;

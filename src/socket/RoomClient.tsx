import io from 'socket.io-client';
import { EventEmitter } from 'events';
import { message } from 'antd';

export interface IChat {
  username: string;
  message: string;
  id: number;
}

export interface IUser {
  id: string;
  username: string;
}

export default class RoomClient extends EventEmitter {

  socket: SocketIOClient.Socket | null;

  closed: boolean;

  chats: Array<IChat>;

  users: { [key: string]: IUser };

  constructor() {
    super();
    this.socket = null;
    this.closed = false;
    this.chats = [];
    this.users = {};
  }

  url = 'http://localhost:9001';

  init(name: string) {
    this.closed = false;
    const signalSocket = io(`${this.url}?name=${encodeURIComponent(name)}`)

    this.socket = signalSocket;

    signalSocket.on('connect', () => {
      console.log('--- start connect ---');
    });

    signalSocket.on('disconnect', () => {
      console.log('--- disconnect ---');
    });

    signalSocket.on('reconnect', (attemptNumber: any) => {
      console.log('RoomClient socket listens reconnect_attempt 尝试重连', attemptNumber);
    });

    signalSocket.on('reconnect_attempt', () => {
      console.log('RoomClient socket listens reconnect_attempt 尝试重连');
    });

    signalSocket.on('reconnect_error', () => {
      console.log('RoomClient socket listens reconnect_error', '重连错误');
    });

    signalSocket.on('reconnect_failed', () => {
      console.log('RoomClient socket listens reconnect_failed', '重连失败');
      this.close();
    });


    signalSocket.on('notification', async (res: { method: any, data: any }) => {
      // if (this.socket !== signalSocket) {
      //   console.log('RoomClient socket不同')
      //   return;
      // }

      // if (this.closed) {
      //   console.log('RoomClient 会议已结束 this.closed', this.closed)
      //   return;
      // }
      console.log(`RoomClient socket notification: [${res.method}]`, res.data);
      try {
        switch (res.method) {
          case this.NotificationType.roomReady:
            console.log('RoomClient roomReady: ', res.data);
            await this.onRoomReady(res.data);
            break;
          case this.NotificationType.newUser:
            console.log('RoomClient newUser: ', res.data);
            await this.onNewUser(res.data);
            break;
          case this.NotificationType.userClosed:
            console.log('RoomClient userClosed: ', res.data);
            await this.onUserClosed(res.data);
            break;
          case this.NotificationType.newMessage:
            console.log('RoomClient newMessage: ', res.data);
            await this.onNewMessage(res.data);
            break;
        }
      } catch (error) {
        console.log(`RoomClient error on socket [notification: ${res.method}]`, error);
      }
    });

    signalSocket.on('hello', (counter: number) => {
      console.log("RoomClient ~ signalSocket.on ~ hello ~ counter", counter)
    });
  }

  async onRoomReady(data: any) {
    const { messages, users } = data;
    for (const item of users) {
      this.users[item.id] = item;
    }
    this.chats = messages;
    this.emit('roomReady')
  }

  async onNewUser(user: IUser) {
    message.info(`${user.username} 加入房间`);
    this.users[user.id] = user;
    this.emit('updateUser')
  }

  async onUserClosed(id: string) {
    const user = this.users[id];
    message.info(`${user.username} 离开房间`);
    delete this.users[id];
    this.emit('updateUser')
  }

  async onNewMessage(data: IChat) {
    this.chats.push(data);
    this.emit('newMessage')
  }

  async sendMsg(msg: string, name: string) {
    await this.request(this.RequestMethod.sendMsg, msg, 1, 1000);
    const chatItem = { username: name, id: this.chats.length + 1, message: msg };
    await this.onNewMessage(chatItem);
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    await this.request(this.RequestMethod.leave, null, 1, 1000);
    console.log('--- RoomClient close ---');
    this.socket && this.socket.close();
  }

  ServerMessage = {
    notification: 'notification',
    request: 'request',
    newMessage: 'newMessage',
  }

  NotificationType = {
    roomReady: 'roomReady',
    newMessage: 'newMessage',
    newUser: 'newUser',
    userClosed: 'userClosed',
  }

  RequestMethod = {
    leave: 'leave',
    sendMsg: 'sendMsg',
  }

  async request(method: string, data: any = {}, retry: number = 1, timeout: number = 10000) {
    console.log(`RoomClient socket request function: [${method}]`, data);
    function timeoutCallback(callback: any) {
      let called = false;

      const interval = setTimeout(
        () => {
          if (called) { return; }
          called = true;
          callback(new SocketTimeoutError('Request timed out'));
        },
        timeout || 10000
      );

      return (...args: any) => {
        if (called) { return; }
        called = true;
        clearTimeout(interval);
        callback(...args);
      };
    }

    const doRequest = (socket: any, mtd: any, dt: any = {}) => {
      if (!socket) {
        return Promise.reject('Peer closed');
      }
      return new Promise((resolve, reject) => {
        socket.emit(
          this.ServerMessage.request,
          { method: mtd, data: dt },
          timeoutCallback((err?: any, response?: any) => {
            if (err) {
              console.log("RoomClient request error", err);
              reject(err);
            } else {
              console.log("RoomClient request response", response);
              resolve(response);
            }
          })
        );
      });
    };

    for (let tries = 0; tries < retry; tries++) {
      try {
        return await doRequest(this.socket, method, data);
      } catch (error) {
        if (error instanceof SocketTimeoutError && tries < retry) {
          console.log('RoomClient _request %s | timeout, retrying [attempt:"%s"]', { method, tries });
        } else {
          throw error;
        }
      }
    }
  }
}

class SocketTimeoutError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'SocketTimeoutError';

    if (Error.hasOwnProperty('captureStackTrace')) {// Just in V8.
      Error.captureStackTrace(this, SocketTimeoutError);
    } else {
      this.stack = (new Error(message)).stack;
    }

  }
}

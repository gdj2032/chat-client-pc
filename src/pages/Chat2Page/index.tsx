import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import './index.scss'
import RoomClient2 from './RoomClient2';
import pathConfig from 'routes/pathConfig';

interface IProps {
  match: any;
  history: any;
}

interface IState {
  name: string;
  room: string;
  value: string;
  chats: any;
  users: any;
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class Chat2Page extends Component<IProps, IState> {

  state: IState = {
    name: this.props.match.params.name,
    room: this.props.match.params.room,
    chats: [],
    users: {},
    value: ''
  }

  roomClient: RoomClient2 | undefined;

  componentDidMount() {
    const { name, room } = this.props.match.params;
    this.roomClient = new RoomClient2();
    this.roomClient.init(name, room);
    this.roomClient.addListener('roomReady', this.onRoomReady);
    this.roomClient.addListener('updateUser', this.onUpdateUser);
    this.roomClient.addListener('newMessage', this.onNewMessage);
  }

  componentWillUnmount() {
    this.onClose();
  }

  onRoomReady = () => {
    this.setState({ users: this.roomClient?.users, chats: this.roomClient?.chats })
  }
  onUpdateUser = () => {
    this.setState({ users: this.roomClient?.users })
  }
  onNewMessage = () => {
    this.setState({ chats: this.roomClient?.chats })
  }

  onClose = () => {
    this.roomClient && this.roomClient.close();
  }

  onBack = () => this.props.history.replace(pathConfig.home)

  onSend = async () => {
    if (this.roomClient) {
      const { value, name } = this.state;
      await this.roomClient.sendMsg(value, name);
      this.setState({ value: '' })
    }
  }

  render() {
    const { value, chats, users, room, name } = this.state;
    return (
      <div className="g-chat-page">
        <Button type="primary" onClick={this.onClose} >关闭</Button>
        <Button type="primary" onClick={this.onBack} >返回</Button>
        <div>用户: {Object.keys(users).length}</div>
        <div>房间号: {room}</div>
        <div>用户名: {name}</div>
        <div>
          <Input
            value={value}
            onChange={(e) => {
              this.setState({ value: e.target.value })
            }}
            className="p-input"
          />
          <Button type="primary" onClick={this.onSend} >发送</Button>
        </div>
        {
          chats && chats.map((e: any) => {
            return (
              <div key={e.id}>
                <span className="p-username">{e.username}: </span>
                <span className="p-msg">{e.message}</span>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Chat2Page;

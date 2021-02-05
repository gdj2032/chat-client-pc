import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
import './index.scss'
import pathConfig from 'routes/pathConfig';

interface IProps {
  history: any;
}

interface IState {
  value: string;
  value2: string;
  room2: string;
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class HomePage extends Component<IProps, IState> {

  state: IState = {
    value: 'ggg',
    value2: 'aaa',
    room2: '111',
  }

  onJoin = () => {
    const { value } = this.state;
    if (!value.trim()) return;
    this.props.history.push(`${pathConfig.chat}/${value}`)
  }

  onJoin2 = () => {
    const { value2, room2 } = this.state;
    if (!value2.trim()) return;
    this.props.history.push(`${pathConfig.chat2}/${value2}/${room2}`)
  }

  render() {
    const { value, value2, room2 } = this.state;
    return (
      <div className="g-home-page">
        <div className="p-room1">
          <Input
            placeholder="name1"
            addonBefore="姓名1"
            value={value}
            onChange={(e) => {
              this.setState({ value: e.target.value })
            }}
            className="p-input"
          />
          <Button type="primary" onClick={this.onJoin}>加入1</Button>
        </div>
        <div style={{ marginTop: '100px' }}></div>
        <div className="p-room1">
          <Input
            placeholder="name2"
            addonBefore="姓名2"
            value={value2}
            onChange={(e) => {
              this.setState({ value2: e.target.value })
            }}
            className="p-input"
          />
          <Input
            placeholder="roomId"
            addonBefore="房间号"
            value={room2}
            onChange={(e) => {
              this.setState({ room2: e.target.value })
            }}
            className="p-input"
          />
          <Button type="primary" onClick={this.onJoin2}>加入2</Button>
        </div>
      </div>
    )
  }
}

export default HomePage;

import React, { Component } from 'react'
import { connect } from 'react-redux';
import './index.scss';
import net, { Socket as NetSocket } from 'net'
import dgram, { Socket as DgramSocket } from 'dgram'
import { Button } from 'antd';
import pathConfig from 'routes/pathConfig';

interface IProps {
  history: any;
}

interface IState {
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class UDPPage extends Component<IProps, IState> {

  state: IState = {}

  socket: NetSocket | DgramSocket | undefined;

  componentDidMount() {
    // this.initTCP()
    // this.initUDP();

    // JS不支持 UDP：原因浏览器只支持HTTP，WebSocket基于HTTP,由WebServers轮循发送请求而实现；

    // NodeJS 支持UDP:原因定位WebApp框架而不是纯网页。
  }

  options = {
    host: '192.168.31.18',
    port: 5678
  }

  initUDP = () => {
    let socket = dgram.createSocket('udp4');
    //发送消息
    socket.send('hello', 9999, function () {
      console.log('成功')
    });
    //接收消息
    socket.on('message', function (data: any) {
      console.log(data.toString());
    })
    socket.on('connect', function (data: any) {
      console.log('connect data: ', data);
    })
    socket.on('close', function (data: any) {
      console.log('close data: ', data);
    })
    this.socket = socket;
  }

  initTCP = () => {
    let socket = new net.Socket();
    // 连接 tcp server
    socket.connect(this.options, function () {
      console.log('connected to Server');
      socket.write('I am socket of node!');
    })

    // 接收数据
    socket.on('data', function (data) {
      console.log('received data: %s from server', data.toString());
    })

    socket.on('end', function () {
      console.log('data end!');
    })

    socket.on('error', function () {
      console.log('socket error!');
    })
    this.socket = socket;
  }

  onClose = () => {
    // this.socket && this.socket.end();
    // this.socket && this.socket.close();
  }

  onBack = () => this.props.history.replace(pathConfig.home)

  render() {
    return (
      <div className="g-udp-page">
        <Button type="primary" onClick={this.onClose} >关闭</Button>
        <Button type="primary" onClick={this.onBack} >返回</Button>
      </div>
    )
  }
}

export default UDPPage;

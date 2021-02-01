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
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class HomePage extends Component<IProps, IState> {

  state: IState = {
    value: 'name'
  }

  onJoin = () => {
    const { value } = this.state;
    if (!value.trim()) return;
    this.props.history.push(`${pathConfig.chat}/${value}`)
  }

  render() {
    const { value } = this.state;
    return (
      <div className="g-home-page">
        <Input
          placeholder="name"
          value={value}
          onChange={(e) => {
            this.setState({ value: e.target.value })
          }}
          className="p-input"
        />
        <Button type="primary" onClick={this.onJoin}>加入</Button>
      </div>
    )
  }
}

export default HomePage;

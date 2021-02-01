import React, { Component } from 'react'
import { connect } from 'react-redux';
import './index.scss'

interface IProps {
  local: any;
}

interface IState {
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class HomePage extends Component<IProps, IState> {

  state: IState = {}

  render() {
    return (
      <div>index</div>
    )
  }
}

export default HomePage;

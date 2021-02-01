import React, { Component } from 'react'
import { connect } from 'react-redux';
import './index.scss'

interface IProps {
  match: any;
}

interface IState {
}

const connect1: any = connect;

@connect1((state: any) => ({
  local: state.local,
}))
class ChatPage extends Component<IProps, IState> {

  state: IState = {
    name: this.props.match.params.name,
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="g-chat-page">ChatPage</div>
    )
  }
}

export default ChatPage;

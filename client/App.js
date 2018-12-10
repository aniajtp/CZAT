import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';

import styles from './App.css';
import styles from './UserForm.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';

const socket = io('/');

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {users: [], messages: [], text: '', name: ''};
    }
};

export default hot(module)(App);

render() {
    return this.state.name !== '' ? (
       this.renderLayout()
    ) : this.renderUserForm()
};

renderLayout() {
    return (
       <div className={styles.App}>
         <div className={styles.AppHeader}>
           <div className={styles.AppTitle}>
             ChatApp
           </div>
           <div className={styles.AppRoom}>
             App room
           </div>
         </div>
         <div className={styles.AppBody}>
           <UsersList
             users={this.state.users}
           />
           <div className={styles.MessageWrapper}>
             <MessageList
               messages={this.state.messages}
             />
             <MessageForm
               onMessageSubmit={message => this.handleMessageSubmit(message)}
               name={this.state.name}
             />
           </div>
         </div>
       </div>
    );
};

renderUserForm() {
  return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
};

componentDidMount() {
  socket.on('message', message => this.messageReceive(message));
  socket.on('update', ({users}) => this.chatUpdate(users));
};

messageReceive(message) {
  const messages = [message, ...this.state.messages];
  this.setState({messages});
};

chatUpdate(users) {
  this.setState({users});
};

handleMessageSubmit(message) {
  const messages = [message, ...this.state.messages];
  this.setState({messages});
  socket.emit('message', message);
};

handleUserSubmit(name) {
  this.setState({name});
  socket.emit('join', name);
};

import React, {Component} from 'react';
import styles from './UserForm.css';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {name: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUserSubmit(this.state.name);
  }

  handleChange(e) {
    this.setState({ name : e.target.value });
  }

  render() {
    return(
      <form className={styles.UserForm} onSubmit={e => this.handleSubmit(e)}>
        <input
          className={styles.UserInput}
          placeholder='Write your nickname and press enter'
          onChange={e => this.handleChange(e)}
          value={this.state.name}
        />
      </form>
    );
  }
}

export default UserForm;

import React from 'react';
import styles from './UsersList.css';

const UsersList = props => (
  <div className={styles.Users}>
    <div className={styles.UsersOnline}>
      {props.users.length} people online
    </div>
    <ul className={styles.UsersList}>
      {
        props.users.map((user) => {
          return (
            <li key={user.id} className={styles.UserItem}>
              {user.name}
            </li>
          );
        })
      }
    </ul>
  </div>
);

export default UsersList;

import React from 'react';
import styles from './MessageList.css';

const Message = props => (
  <div className={styles.Message}>
    <strong>{props.from} :</strong>
    <span>{props.text}</span>
  </div>
);

const MessageList = props => (
  <div className={styles.MessageList}>
    {
      props.messages.map((message, i) => {
        return (
          <Message
            key={i}
            from={message.from}
            text={message.text}
          />
        );
      })
    }
  </div>
);

export default MessageList;

import React, {Component} from 'react';
import styles from './MessageForm.css';

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.setState({ text : e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = {
      from : this.props.name,
      text : this.state.text
    };
    this.props.onMessageSubmit(message);
    this.setState({ text: '' });
  }

  changeHandler(e) {
    this.setState({ text : e.target.value });
  }

  render() {
    return(
      <form className={styles.MessageForm} onSubmit={e => this.handleSubmit(e)}>
        <input
          className={styles.MessageInput}
          onChange={e => this.changeHandler(e)}
          value={this.state.text}
          placeholder='Message'
        />
      </form>
    );
  }
}

export default MessageForm;

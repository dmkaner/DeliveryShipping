import React, { Component } from 'react';
import firebase from 'react-native-firebase';

import { createRootNavigator } from "./src/router/router";


export default class App extends Component {

  state = { loggedIn: null };

  constructor() {  //check this logic
    super();
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {   //figure out how to unsubscribe
        if (user) {
            this.setState({ loggedIn: true });
        } else {
            this.setState({ loggedIn: false });
        }
    });
}

  render() {
    const { loggedIn } = this.state;
    const Layout = createRootNavigator(loggedIn);
    return <Layout />;
  }
}


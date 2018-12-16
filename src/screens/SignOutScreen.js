import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { Container, Text } from 'native-base';

export default class SignOutScreen extends Component {

    static navigationOptions = {
        title: 'Logistics'
    };

    constructor(props) {
        super(props);
        firebase.auth().signOut();
    }
    render() {
        return (
            <Container>
                <Text>Hello</Text>
            </Container>
        );
    }
}
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'native-base';

export default class HelpScreen extends Component {

    static navigationOptions = {
        title: 'Help'
    };

    render() {

        return (
            <View>
                <Button onPress={() => {this.props.navigation.openDrawer()}} />
            </View>
        );
    }
}
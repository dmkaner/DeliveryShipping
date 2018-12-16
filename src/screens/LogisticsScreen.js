import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { Button, Container, Content, Form, Item, Input, Label, Text } from 'native-base';

export default class LogisticsScreen extends Component {

    static navigationOptions = {
        title: 'Logistics'
    };

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.user = firebase.auth().currentUser;
        this.state = {
            boxQ: '',
            shippingLabelQ: '',
            boxSizeQ: '',
            pickupCount: this.props.navigation.getParam('pickupCount',0)
        };
    }

    postOrderInfo() {
        var addLogistics = this.ref.doc(this.user.uid).collection('pickups').doc(this.state.pickupCount.toString()).update({
            boxQ: this.state.boxQ, 
            shippingLabelQ: this.state.shippingLabelQ, 
            boxSizeQ: this.state.boxSizeQ,
        });
    }

    completeOrder() {
        this.postOrderInfo();

        this.ref = firebase.firestore().collection(`stripe_customers/${this.user.uid}/charges`);
        this.ref.add({
            source: null,
            amount: 500
        });

        this.props.navigation.navigate('Pickups');
    }

    render() {

        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Do you have a box?</Label>
                            <Input onChangeText={(text) => this.setState({ boxQ:text })}/>
                        </Item>
                        <Item floatingLabel>
                            <Label>You have the shipping label</Label>
                            <Input onChangeText={(text) => this.setState({ shippingLabelQ:text })}/>
                        </Item>
                        <Item floatingLabel last>
                            <Label>Item Size Roughly</Label>
                            <Input onChangeText={(text) => this.setState({ boxSizeQ:text })}/>
                        </Item>
                    </Form>
                    <Button block style={{ margin: 15 }} onPress={() => this.completeOrder()}>
                        <Text>Pay with Saved Card</Text>
                    </Button>
                    <Button block style={{ margin: 15 }} onPress={() => this.completeOrder()}>
                        <Text>Pay with Other</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
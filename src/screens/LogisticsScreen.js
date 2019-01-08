import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { Button, Container, Content, Form, Item, Input, Label, Text, Header, Left, Right, Body, Picker, Icon, Root, Toast } from 'native-base';

export default class LogisticsScreen extends Component {

    static navigationOptions = {
        title: 'Logistics',
        header: null
    };

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.user = firebase.auth().currentUser;
        this.state = {
            boxQ: undefined,
            shippingLabelQ: undefined,
            boxSizeQ: undefined,
            pickupCount: this.props.navigation.getParam('pickupCount',0)
        };
    }

    postOrderInfo() {
        let date = new Date();

        var addLogistics = this.ref.doc(this.user.uid).collection('pickups').doc(this.state.pickupCount.toString()).update({
            boxQ: this.state.boxQ, 
            shippingLabelQ: this.state.shippingLabelQ, 
            boxSizeQ: this.state.boxSizeQ,
            dateOrdered: date,
            status: 'processing'
        });
    }

    completeOrder() {
        this.stripeUserRef = firebase.firestore().collection(`stripe_customers/${this.user.uid}/charges`);
        this.stripeUserRef.add({
            source: null,
            amount: 500
        })
        .then(this.onSuccess.bind(this))
        .catch(this.onFail.bind(this));
    }

    onFail(){
        this.onBackButton();
        Toast.show({
            text: 'Payment Failed',
            buttonText: 'Okay',
            type: 'danger'
        });
    }

    onSuccess(){
        this.postOrderInfo();
        this.props.navigation.navigate('Home');
        this.props.navigation.navigate('Pickups');
        Toast.show({
            text: 'Payment Succeded',
            buttonText: 'Okay',
            type: 'success'
        });
    }

    onBackButton() {
        var deleteRecentPickup = this.ref.doc(this.user.uid).collection('pickups').doc(this.state.pickupCount.toString()).delete();
        var updatePickupCount = this.ref.doc(this.user.uid).set({
            pickupCount: this.state.pickupCount-1
        });

        this.props.navigation.navigate('Home');
    }

    // preciseOrEstimate() {
    //    console.log(this.state.boxQ)
    //     if (this.state.boxQ == true) {
            // <Item picker>
            //     <Picker
            //         mode="dropdown"
            //         iosIcon={<Icon name="ios-arrow-down-outline" />}
            //         style={{ width: undefined }}
            //         placeholder="What is the package size, roughly?"
            //         placeholderStyle={{ color: "#bfc6ea" }}
            //         placeholderIconColor="#007aff"
            //         selectedValue={this.state.boxSizeQ}
            //         onValueChange={(val) => this.setState({ boxSizeQ:val })}
            //     >
            //         <Picker.Item label="Small" value={true} />
            //         <Picker.Item label="Medium" value={false} />
            //         <Picker.Item label="Large" value={false} />
            //     </Picker>
            // </Item>
    //     } else if (this.state.boxQ == false) {
    //         <Item floatingLabel last>
    //             <Label>What are the item dimensions?</Label>
    //             <Input onChangeText={(text) => this.setState({ boxSizeQ:text })}/>
    //         </Item>
    //     } else {
    //         return <Item></Item>
    //     }
    // }

    render() {

        return (
            <Root>
                <Container>
                    <Content>

                        <Header transparent style={{marginBottom: 15}}>
                            <Left>
                                <Button iconLeft transparent onPress={ () => this.onBackButton() }>
                                    <Icon name='arrow-back' />
                                </Button>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                            </Right>
                        </Header>

                        <Text style={{fontSize: 30, marginBottom: 30, fontWeight: "bold", alignSelf:'center'}}>Package Info</Text>

                        <Form>
                            
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    style={{ width: undefined }}
                                    placeholder="Do you need a box?"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.boxQ}
                                    onValueChange={(val) => this.setState({ boxQ:val })}
                                >
                                    <Picker.Item label="Yes" value={true} />
                                    <Picker.Item label="No" value={false} />
                                </Picker>
                            </Item>

                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    style={{ width: undefined }}
                                    placeholder="Do you have a shipping label?"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.shippingLabelQ}
                                    onValueChange={(val) => this.setState({ shippingLabelQ:val })}
                                >
                                    <Picker.Item label="Yes" value={true} />
                                    <Picker.Item label="No" value={false} />
                                </Picker>
                            </Item>

                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    style={{ width: undefined }}
                                    placeholder="What is the package size, roughly?"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.boxSizeQ}
                                    onValueChange={(val) => this.setState({ boxSizeQ:val })}
                                >
                                    <Picker.Item label="Small" value='small' />
                                    <Picker.Item label="Medium" value='medium' />
                                    <Picker.Item label="Large" value='large' />
                                </Picker>
                            </Item>

                            {/* { this.preciseOrEstimate() } */}
                            
                            
                            {/* <Item floatingLabel>
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
                            </Item> */}
                        </Form>
                        <Button block bordered rounded style={{ margin: 15 }} onPress={() => this.completeOrder()}>
                            <Text>Pay $5</Text>
                        </Button>
                    </Content>
                </Container>
            </Root>
        );
    }
}
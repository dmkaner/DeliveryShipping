import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Button, Container, Content, Text, Input, Form, Item, Label, Left, Body, Right, Icon, Header } from 'native-base';
//import { Card, CardSection, Input } from '../components/common';

export default class SignUpScreen extends Component {

    static navigationOptions = {
        title: 'Sign Up',
        header: null
    };

    state = { 
        emailUp: '', 
        passwordUp: '', 
        error:'',
    };

    ref = firebase.firestore().collection('users');

    onSignUpButtonPress() {
        const { emailUp, passwordUp } = this.state;

        this.setState({ error: '' });

        firebase.auth().createUserWithEmailAndPassword(emailUp, passwordUp)
            .then(this.onSuccess.bind(this))
            .catch(this.onFail.bind(this));
    }

    onFail(){
        this.setState({ 
            error: 'Authentication Failed'
        });
    }

    onSuccess(){
        let user = firebase.auth().currentUser;
        firebase.firestore().collection('users').doc(user.uid).set({
            pickupCount:0
        });

        // stripe.customers.create({
        //     email: user.email,
        // }).then((customer) => {
        //     admin.database().ref(`/stripe_customers/${user.uid}/customer_id`).set(customer.id);
        // });
    }

    render() {
        return (

            <Container>
                <Content>
                    <Header transparent>
                        <Left>
                        </Left>
                        <Body>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    
                    <Text style={{marginStart: 15, fontSize: 30, fontWeight: "bold"}}>Sign Up</Text>

                    <Form style={{margin: 15}}>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                autoCorrect={false}
                                value={this.state.emailUp}
                                onChangeText={text => this.setState({ emailUp: text })}
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                value={this.state.passwordUp}
                                onChangeText={text => this.setState({ passwordUp: text})}
                            />
                        </Item>
                    </Form>

                    <Button block bordered rounded onPress={this.onSignUpButtonPress.bind(this)} style={{margin: 15}}>
                        <Text>Sign Up</Text>
                    </Button>
                    <Button block bordered rounded onPress={ () => this.props.navigation.navigate('SignIn')} style={{margin: 15}}>
                        <Text>Sign In</Text>
                    </Button> 

                    <Text style={Styles.errorTextStyle}>{this.state.error}</Text>

                </Content>
            </Container>
        );
    }
}

const Styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    header: {
        fontSize: 20,
        flex: 1,
        textAlign: 'center',
        
    }
}
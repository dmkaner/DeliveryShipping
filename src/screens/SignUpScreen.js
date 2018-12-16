import React, { Component } from 'react';
import { Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Button } from 'native-base';
import { Card, CardSection, Input } from '../components/common';

export default class SignUpScreen extends Component {

    static navigationOptions = {
        title: 'Sign Up',
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
            <Card>
                <CardSection>
                    <Text style={Styles.header}>Sign Up</Text>
                </CardSection>

                <CardSection>
                    <Input
                        placeholder='example@gmail.com'
                        label='Email'
                        value={this.state.emailUp}
                        onChangeText={text => this.setState({ emailUp: text })}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry={true}
                        placeholder='password'
                        label='Password'
                        value={this.state.passwordUp}
                        onChangeText={text => this.setState({ passwordUp: text })}
                    />
                </CardSection>

                <CardSection>
                    <Button onPress={this.onSignUpButtonPress.bind(this)}>
                        <Text>Sign Up</Text>
                    </Button>
                </CardSection>

                <CardSection>
                    <Button onPress={ () => this.props.navigation.navigate('SignIn')}>
                        <Text>Sign In</Text>
                    </Button>
                </CardSection>

                <Text style={Styles.errorTextStyle}>{this.state.error}</Text>

            </Card>
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
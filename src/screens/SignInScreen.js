import React, { Component } from 'react';
import { Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Button } from 'native-base';
import { Card, CardSection, Input } from '../components/common';


export default class SignInScreen extends Component {

    static navigationOptions = {
        title: 'Sign In',
    };

    state = { 
        emailIn: '', 
        passwordIn: '', 
        error:'',
    };

    onSignInButtonPress() {
        const { emailIn, passwordIn } = this.state;

        this.setState({ error: '' });

        firebase.auth().signInWithEmailAndPassword(emailIn, passwordIn)
            .then(this.onSuccess.bind(this))
            .catch(this.onFail.bind(this));
    }

    onFail(){
        this.setState({ 
            error: 'Authentication Failed'
        });
    }

    onSuccess(){
        this.setState({
            emailIn: '',
            passwordIn: '',
            error: '',
        });
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Text style={Styles.header}>Sign In</Text>
                </CardSection>

                <CardSection>
                    <Input
                        placeholder='example@gmail.com'
                        label='Email'
                        value={this.state.emailIn}
                        onChangeText={text => this.setState({ emailIn: text })}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry={true}
                        placeholder='password'
                        label='Password'
                        value={this.state.passwordIn}
                        onChangeText={text => this.setState({ passwordIn: text})}
                    />
                </CardSection>

                <CardSection>
                    <Button onPress={this.onSignInButtonPress.bind(this)}>
                        <Text>Sign In</Text>
                    </Button>
                </CardSection>

                <CardSection>
                    <Button onPress={ () => this.props.navigation.navigate('SignUp')}>
                        <Text>Sign Up</Text>
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
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Button, Container, Content, Text, Input, Form, Item, Label, Left, Body, Right, Icon, Header } from 'native-base';
//import { Card, CardSection, Input } from '../components/common';


export default class SignInScreen extends Component {

    static navigationOptions = {
        title: 'Sign In',
        header: null
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
            <Container>
                <Content>
                    <Header transparent>
                        <Left>
                            <Button iconLeft transparent onPress={ () => this.props.navigation.navigate('SignUp')}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    
                    <Text style={{marginStart: 15, fontSize: 30, fontWeight: "bold"}}>Sign In</Text>

                    <Form style={{margin: 15}}>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                autoCorrect={false}
                                value={this.state.emailIn}
                                onChangeText={text => this.setState({ emailIn: text })}
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                value={this.state.passwordIn}
                                onChangeText={text => this.setState({ passwordIn: text})}
                            />
                        </Item>
                    </Form>

                    <Button block bordered rounded onPress={this.onSignInButtonPress.bind(this)} style={{margin: 15}}>
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
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Card, CardSection, Spinner, Input, Button } from '../components/common';


class RequestPickupScreen extends Component {

    state = { addressFrom: '', addressTo: '', loading: false, error: '' }

    static navigationOptions = {
        title: 'Request Pickup',
    };

    addRandomPost = () => {
        this.ref.add({
            name: 'DMK',
            paid: false,
            addressFrom: this.state.addressFrom,
            addressTo: this.state.addressTo,
        }).then(this.onSuccess.bind(this)).catch(this.onFail.bind(this));
    }

    onSubmitButtonPress() {
        const { address } = this.state;
        
        this.ref = firebase.firestore().collection('Orders');
        this.addRandomPost();

        this.setState({ error: '', loading: true });
        this.props.navigation.navigate('StripePay');
    }

    renderSubmitButton() {
        if (this.state.loading) {
            return <Spinner size='small' />
        }
        return <Button
            buttonText='Submit'
            onPress={this.onSubmitButtonPress.bind(this)}
        />
    }

    onFail() {
        this.setState({
            error: 'Submission Failed',
            loading: false,
        });
    }

    onSuccess() {
        this.setState({
            addressFrom: '',
            addressTo: '',
            error: '',
            loading: false,
        });
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Input
                            placeholder='Home'
                            label='Where From'
                            value={this.state.address}
                            onChangeText={text => this.setState({ addressFrom: text })}
                        />
                    </CardSection>
                    
                    <CardSection>
                        <Input
                            placeholder='Post Office'
                            label='Where To'
                            value={this.state.address}
                            onChangeText={text => this.setState({ addressTo: text })}
                        />
                    </CardSection>

                    <CardSection>
                        {this.renderSubmitButton()}
                    </CardSection>

                    <Text style={Styles.errorTextStyle}>{this.state.error}</Text>

                </Card>
            </View>
        );
    }
}

const Styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}

export default RequestPickupScreen;















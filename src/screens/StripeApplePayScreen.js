import React, { PureComponent } from 'react';
import Stripe from 'react-native-stripe-api';
import firebase from 'react-native-firebase';
import { View } from 'react-native';
import { CreditCardInput } from "react-native-credit-card-input";
import { Button, Text } from 'native-base';
import { Card, CardSection } from '../components/common';

export default class StripeApplePayScreen extends PureComponent {

    state = { error: '', loading: false, cardInfo: null }

    _onChange = (formData) => this.setState({ cardInfo:formData });

    async onSubmitButtonPress() {

        let apiKey = "";
        firebase.firestore().collection('stripe_skey').get().then((snapshot) => {
            apiKey = snapshot.docs[0].data();
        });
        //apiKey = "sk_test_C1wiMUUQLIhnzUinvW1KIBqy";
        const client = new Stripe(apiKey);
        const currentUser = firebase.auth().currentUser;

        const tokenVal = await client.createToken({
            number: this.state.cardInfo.values.number.replace(/ +/g, ""),
            exp_month: this.state.cardInfo.values.expiry.slice(0, 2), 
            exp_year: this.state.cardInfo.values.expiry.slice(3), 
            cvc: this.state.cardInfo.values.cvc
        });

        console.log(tokenVal);

        this.ref = firebase.firestore().collection(`stripe_customers/${currentUser.uid}/tokens`);
        this.ref.add({token: tokenVal.id});

        this.ref = firebase.firestore().collection(`stripe_customers/${currentUser.uid}/charges`);
        this.ref.add({
            source: null,
            amount: 100000
        });
    }

    render() {
        return(
            <View>
                <Card>
                    <CardSection>
                        <CreditCardInput onChange={(this._onChange)} />
                    </CardSection>
                    <CardSection>
                        <Button onPress={this.onSubmitButtonPress.bind(this)}>
                            <Text>Submit</Text>
                        </Button>
                    </CardSection>
                </Card>
            </View>
        )
    }
}

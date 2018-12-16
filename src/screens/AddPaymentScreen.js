import React, { PureComponent } from 'react';
import Stripe from 'react-native-stripe-api';
import firebase from 'react-native-firebase';
import { View } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Button, Text, Container, Content } from 'native-base';

export default class AddPaymentScreen extends PureComponent {

    static navigationOptions = {
        title: 'Add Payment'
    };

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('stripe_skey');
        this.unsubscribe = null;

        this.state = { 
            error: '', 
            loading: false, 
            cardInfo: null,
            skey: '' 
        };
    }

    _onChange = (formData) => this.setState({ cardInfo:formData });

    componentDidMount() {
        this.unsubscribe = this.ref.doc('skey').onSnapshot(this.onCollectionUpdate); 
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        this.setState({ 
            skey: querySnapshot.data().key
        });
    }

    async onSubmitButtonPress() {

        let apiKey = this.state.skey;

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
        
    }

    render() {

        return (
            <Container>
                <Content>
                    <CreditCardInput onChange={(this._onChange)} />
                    
                    <Button onPress={this.onSubmitButtonPress.bind(this)}>
                        <Text>Add Card</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}





import React, { PureComponent } from 'react';
import Stripe from 'react-native-stripe-api';
import firebase from 'react-native-firebase';
import { View } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Button, Root, Text, Container, Content, Header, Left, Right, Body, Icon, Toast } from 'native-base';

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

        if (this.state.cardInfo){

            try {
                const token = await client.createToken({
                    number: this.state.cardInfo.values.number.replace(/ +/g, ""),
                    exp_month: this.state.cardInfo.values.expiry.slice(0, 2), 
                    exp_year: this.state.cardInfo.values.expiry.slice(3), 
                    cvc: this.state.cardInfo.values.cvc
                })

                this.ref = firebase.firestore().collection(`stripe_customers/${currentUser.uid}/tokens`);
                this.ref.add({token: token.id});
                
                Toast.show({
                    text: 'Card Added Successfully',
                    buttonText: 'Okay',
                    type: 'success'
                });
            } catch (error) {
                Toast.show({
                    text: 'Invalid Card',
                    buttonText: 'Okay',
                    type: 'danger'
                });
            }

        } else {
            Toast.show({
                text: 'Must Fill All Fields',
                buttonText: 'Okay',
                type: 'danger'
            });
        }
    }

    render() {

        return (
            <Root>
            <Container>
                <Content>
                    <Header transparent style={{ marginBottom: 30 }}>
                        <Left>
                            <Button transparent onPress={() => {this.props.navigation.openDrawer()}}>
                                <Icon name='menu' style={{fontSize: 35, color: 'black'}}/>
                            </Button>
                        </Left>
                        <Body>
                            {/* nothing */}
                        </Body>
                        <Right>
                            {/* nothing */}
                        </Right>
                    </Header>

                    <CreditCardInput onChange={(this._onChange)}/>
                    
                    <Button block rounded bordered onPress={this.onSubmitButtonPress.bind(this)} style={{ margin: 30 }}>
                        <Text>Add Card</Text>
                    </Button>
                </Content>
            </Container>
            </Root>
        );
    }
}






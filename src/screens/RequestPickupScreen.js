import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { Container, Button, Text, Content, Form, Item, Input, Label } from 'native-base';
import firebase from 'react-native-firebase';

export default class RequestPickupScreen extends Component {

    static navigationOptions = {
        title: 'Request Pickup'
    };

    constructor(props) {
        super(props);
        this.user = firebase.auth().currentUser;
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        
        this.state = {
            pickupLat: this.props.navigation.getParam('lat',''),
            pickupLong: this.props.navigation.getParam('long',''),
            pickupAddress: this.props.navigation.getParam('location',''),
            dropOffAddress: '',
            pickupSuggestions: [],
            pickupCount: 0
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.doc(this.user.uid).onSnapshot(this.onCollectionUpdate) 
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        this.setState({ 
            pickupCount: querySnapshot.data().pickupCount
        });
    }

    getPlaces() {
        const url = this.getUrlWithParamters();
        fetch(url)
            .then((data) => data.json())
            .then((res) => {
                let arrayHolder = [];
                res.results.map((vars) => {
                    arrayHolder.push(
                        <Text onPress={() => this.setDropoffFromSuggestion(vars.vicinity)}>{vars.name}</Text>
                    );
                    this.setState({pickupSuggestions: arrayHolder})
                })
            });
    }

    getUrlWithParamters() {
        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
        const location = `location=${this.state.pickupLat},${this.state.pickupLong}&radius=500`;
        const typeData = '&types=store';
        const key = '&key=AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs';
        return `${url}${location}${typeData}${key}`;
    }

    setDropoffFromSuggestion(location){
        this.setState({dropOffAddress: location});
    } 

    postOrderInfo() {
        var initiatePickup = this.ref.doc(this.user.uid).collection('pickups').doc((this.state.pickupCount+1).toString()).set({
            user: this.user.uid, 
            paid: false, 
            addressFrom: this.state.pickupAddress,
            addressTo: this.state.dropOffAddress,
        });
        var updatePickupCount = this.ref.doc(this.user.uid).set({
            pickupCount: this.state.pickupCount+1
        });
        this.props.navigation.navigate('Logistics', { pickupCount: this.state.pickupCount+1 });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Pickup Address</Label>
                            <Input 
                                onChangeText={(text) => this.setState({pickupAddress: text})}
                                value={this.props.navigation.getParam('location','')} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Drop-off Address</Label>
                            <Input 
                                onChangeText={(text) => this.setState({dropOffAddress: text})}
                                onFocus={() => this.getPlaces()}
                                value={this.state.dropOffAddress}/>
                        </Item>
                        <Container style={styles.textContainer}>
                            <Text>Suggestions</Text>
                            {this.state.pickupSuggestions}
                        </Container>
                    </Form>
                    <Button block style={{ margin: 15 }} onPress={() => {this.postOrderInfo()}}>
                        <Text>Continue</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});
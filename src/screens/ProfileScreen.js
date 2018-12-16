import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { Button, Container, Content, Form, Item, Label, Input, Text } from 'native-base';

export default class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'Profile'
    };

    constructor(props) {
        super(props);
        this.user = firebase.auth().currentUser;
        this.ref = firebase.firestore().collection('users');
        // this.unsubscribe = null;
        
        this.state = {
            name: '',
            homeAddress: '',
            phoneNumber: '',
            editFields: false
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.doc(this.user.uid).collection('profile').onSnapshot(this.onCollectionUpdate) 
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        console.log(querySnapshot.docs[0])
        this.setState({ 
            name: querySnapshot,
            homeAddress: querySnapshot,
            phoneNumber: querySnapshot
        });
    }

    updateProfileWithFormFields() {
        this.setState({ editFields:false });

        var profileInfo = this.ref.doc(this.user.uid).collection('profile').add({
            name: this.state.name, 
            homeAddress: this.state.homeAddress, 
            phoneNumber: this.state.phoneNumber
        });
    }

    cancelUpdate() {
        this.setState({ editFields:false });
    }

    renderButton() {
        if(this.state.editFields){
            return (
                <Container>
                    <Button block style={{ margin: 15 }} onPress={() => this.updateProfileWithFormFields()}>
                        <Text>Edit Profile</Text>
                    </Button>
                    <Button block style={{ margin: 15 }} onPress={() => this.cancelUpdate()}>
                        <Text>Cancel</Text>
                    </Button>
                </Container>
            )
        } 
    }

    makeSubmitButtonVisible() {
        this.setState({ editFields:true });
    }

    render() {
        return (
            <Container>
                <Content>

                    <Form>
                        <Item floatingLabel>
                            <Label>Name</Label>
                            <Input 
                                onChangeText={(text) => this.setState({name:text})}
                                onFocus={() => this.makeSubmitButtonVisible()}
                                value={this.state.name} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Home Address</Label>
                            <Input 
                                onChangeText={(text) => this.setState({homeAddress:text})}
                                onFocus={() => this.makeSubmitButtonVisible()}
                                value={this.state.homeAddress} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Phone Number</Label>
                            <Input 
                                onChangeText={(text) => this.setState({phoneNumber:text})}
                                onFocus={() => this.makeSubmitButtonVisible()}
                                value={this.state.phoneNumber} />
                        </Item>
                    </Form>

                    {this.renderButton()}

                    <Button onPress={() => {this.props.navigation.openDrawer()}}>
                        <Text>Open Drawer</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
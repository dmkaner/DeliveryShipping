import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import firebase from 'react-native-firebase';
import { Header, Button, Container, Content, Form, Item, Label, Input, Text, Left, Body, Right, Icon } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker'

const userIcon = require("../../assets/user.png");

export default class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'Profile'
    };

    constructor(props) {
        super(props);
        this.user = firebase.auth().currentUser;
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        
        this.state = {
            name: '',
            homeAddress: '',
            phoneNumber: '',
            editFields: false,
            imageLoading: false,
            dp: null
        };
    }

    openPicker() {
        this.setState({imageLoading: true})

        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        const userID = this.user.uid;

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            mediaType: 'photo'
        }).then(image => {

            const imagePath = image.path
            let uploadBlob = null
        
            const imageRef = firebase.storage().ref(userID).child("dp.jpg")
            let mime = 'image/jpg'
            fs.readFile(imagePath, 'base64')
                .then((data) => {
                //console.log(data);
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                uploadBlob = blob
                return imageRef.put(blob._ref, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
            })
            .then((url) => {
    
                let userData = {}
        
                this.setState({loading: false, dp: url})
        
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
        console.log(error)
        })
    }

    componentDidMount() {
        this.unsubscribe = this.ref.doc(this.user.uid).collection('profile').onSnapshot(this.onCollectionUpdate) 

        const imageRef = firebase.storage().ref(this.user.uid).child("dp.jpg")
        imageRef.getDownloadURL().then(function(url) {
            this.setState({dp: url});
        }.bind(this)).catch((error)=> {console.log(error, 'no prof pic')});
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        console.log(querySnapshot.docs)
        if ( Array.isArray(querySnapshot.docs) && querySnapshot.docs.length) {
            this.setState({ 
                name: querySnapshot.docs[0].data().name,
                homeAddress: querySnapshot.docs[0].data().homeAddress,
                phoneNumber: querySnapshot.docs[0].data().phoneNumber
            });
        }
    }

    updateProfileWithFormFields() {
        this.setState({ editFields:false });

        var profileInfo = this.ref.doc(this.user.uid).collection('profile').doc('info').set({
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
                    <Button block bordered rounded style={{ margin: 15 }} onPress={() => this.updateProfileWithFormFields()}>
                        <Text>Edit Profile</Text>
                    </Button>
                    <Button block bordered rounded style={{ margin: 15 }} onPress={() => this.cancelUpdate()}>
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

        const dpr = this.state.dp ? (
            <TouchableOpacity onPress={ () => this.openPicker() }>
                <Image
                    style={{width: 150, height: 150, alignSelf: 'center', marginBottom: 30, borderRadius: 75 }}
                    source={{uri: this.state.dp}}
                />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={ () => this.openPicker() }>
                <Image square style={{width: 150, height: 150, alignSelf: 'center', marginBottom: 30 }} source={userIcon} />
            </TouchableOpacity>
        )

        const dps = this.state.loading ? <ActivityIndicator animating={this.state.loading} /> : (
            <View>
                { dpr }
            </View>
        )

        return (
            <Container>
                <Content>

                    <Header transparent>
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

                    <Text style={{marginStart: 15, marginTop: 15, marginBottom: 30, fontSize: 30, fontWeight: "bold"}}>Profile</Text>

                    { dps }

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

                </Content>
            </Container>
        );
    }
}


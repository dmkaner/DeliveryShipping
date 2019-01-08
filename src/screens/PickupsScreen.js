import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { Button, Container, Text, Content, Card, CardItem, Right, Left, Body, Icon, Root, Toast } from 'native-base';

export default class PickupsScreen extends Component {

    static navigationOptions = {
        title: 'Pickups'
    };

    constructor(props) {
        super(props);
        this.user = firebase.auth().currentUser;
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        
        this.state = {
            pickups: []
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.doc(this.user.uid).collection('pickups').onSnapshot(this.onCollectionUpdate); 
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {

        // querySnapshot.docChanges.forEach(change => {
        //     console.log('hello', change.doc.data());
        // });
        // console.log(querySnapshot.docs[0].data());
        
        this.setState({ 
            pickups: querySnapshot.docs
        });
    }

    render() {

        return (
            <Root>
                <Container>
                    <Content>
                        {this.state.pickups.map((pickup, index) => {
                            return(
                                <Card key={index} style={{borderRadius:10, marginRight:10, marginLeft:10, marginTop:15}}>
                                    {/* <CardItem>
                                        <Text>{pickup.data().addressFrom}</Text>
                                    </CardItem> */}

                                    <CardItem>
                                        <Left>
                                            {/* <Thumbnail source={{uri: 'Image URL'}} /> */}
                                            <Body>
                                                <Text>Date</Text>
                                                {/* <Text note>GeekyAnts</Text> */}
                                            </Body>
                                        </Left>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Body style={{flexDirection:'row', justifyContent: 'space-evenly', height:100, alignItems:'center'}}>
                                            <Icon name="hourglass-half" type="FontAwesome" />
                                            <Icon name="arrow-right" type="FontAwesome" style={{fontSize: 20}}/>
                                            <Icon name="home" type="FontAwesome" />   
                                            <Icon name="arrow-right" type="FontAwesome" style={{fontSize: 20}}/>  
                                            <Icon name="cubes" type="FontAwesome" />                               
                                        </Body>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Text>{pickup.data().addressFrom}</Text>
                                        </Left>
                                        {/* <Body>
                                            <Icon name="arrow-right" type="FontAwesome" />
                                        </Body> */}
                                        <Right>
                                            <Text>{pickup.data().addressTo}</Text>
                                        </Right>
                                    </CardItem>
                                </Card>
                            );
                        })}
                    </Content>

                    <Button onPress={() => {this.props.navigation.openDrawer()}}>
                        <Text>yo</Text>
                    </Button>
                </Container>
            </Root>
        );
    }
}
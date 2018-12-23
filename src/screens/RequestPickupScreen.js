import React, { Component } from 'react';
import { Container, Button, Text, Content, Header, Left, Right, Body, Icon, Root, Toast } from 'native-base';
import firebase from 'react-native-firebase';
import geolib from 'geolib';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};

export default class RequestPickupScreen extends Component {

    static navigationOptions = {
        title: 'Request Pickup',
        header: null
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
            pickupCount: 0,
            pickupDetails: [],
            dropOffDetails: []
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.doc(this.user.uid).onSnapshot(this.onCollectionUpdate)
        
        // if (this.state.pickupAddress != '' && this.state.pickupAddress != null) {
        //     this.getPlaces()
        // }
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        this.setState({ 
            pickupCount: querySnapshot.data().pickupCount
        });
    }

    // getPlaces() {
    //     const url = this.getUrlWithParamters();
    //     fetch(url)
    //         .then((data) => data.json())
    //         .then((res) => {
    //             let arrayHolder = [];
    //             res.results.map((vars) => {
    //                 arrayHolder.push(
    //                     <Text onPress={() => this.setDropoffFromSuggestion(vars.vicinity)}>{vars.name}</Text>
    //                 );
    //                 this.setState({pickupSuggestions: arrayHolder})
    //             })
    //         });
    // }

    // getUrlWithParamters() {
    //     const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    //     const location = `location=${this.state.pickupLat},${this.state.pickupLong}&radius=500`;
    //     const typeData = '&types=store';
    //     const key = '&key=AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs';
    //     return `${url}${location}${typeData}${key}`;
    // }

    // setDropoffFromSuggestion(location){
    //     this.setState({dropOffAddress: location});
    // } 

    postOrderInfo() {
        if (this.state.pickupAddress != '' && 
            this.state.pickupAddress != null && 
            this.state.dropOffAddress != '' &&
            this.state.dropOffAddress != null) {

            let pickupLat = ''
            let pickupLong = ''
            let dropOffLat = ''
            let dropOffLong = ''
    
            if (this.state.pickupLat != '' && this.state.pickupLong != ''){
                pickupLat = this.state.pickupLat
                pickupLong = this.state.pickupLong
            } else {
                pickupLat = this.state.pickupDetails.geometry.location.lat
                pickupLong = this.state.pickupDetails.geometry.location.lng
            }
            dropOffLat = this.state.dropOffDetails.geometry.location.lat
            dropOffLong = this.state.dropOffDetails.geometry.location.lng

            let addressDistance = geolib.getDistance(
                {latitude: pickupLat, longitude: pickupLong},
                {latitude: dropOffLat, longitude: dropOffLong}
            );

            if (addressDistance <= 8000) {
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
            } else {
                Toast.show({
                    text: 'Distance must be less than 5 miles',
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

                        <Header transparent style={{marginBottom: 15}}>
                            <Left>
                                <Button iconLeft transparent onPress={ () => this.props.navigation.navigate('Home')}>
                                    <Icon name='arrow-back' />
                                </Button>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                            </Right>
                        </Header>

                        <Text style={{fontSize: 30, marginBottom: 30, fontWeight: "bold", alignSelf:'center'}}>Request Pickup</Text>

                        <GooglePlacesAutocomplete
                            placeholder='Pickup'
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                console.log(data, details);
                                this.setState({ pickupDetails: details });
                                this.setState({ pickupAddress: data.description })
                            }}
                            
                            getDefaultValue={() => this.props.navigation.getParam('location','')}
                            
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs',
                                language: 'en', // language of the results
                                // types: '(cities)' // default: 'geocode'
                            }}
                            
                            styles={{
                                textInputContainer: {
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    borderWidth: 0,
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    height: 40,
                                    borderRadius: 10,
                                    borderWidth: 0.5,
                                },
                                description: {
                                    fontWeight: 'bold'
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                }
                            }}
                            
                            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                            currentLocationLabel="Current location"
                            // nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            // GooglePlacesSearchQuery={{
                            //     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            //     rankby: 'distance',
                            //     types: 'store'
                            // }}
                        
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            predefinedPlaces={[homePlace]}
                        
                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            // renderLeftButton={()  => <Icon type='Feather' name='package'/>}
                            // renderRightButton={() => <Text>Custom text after the input</Text>}
                        />

                        <GooglePlacesAutocomplete
                            placeholder='Drop off'
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                console.log(data, details);
                                this.setState({ dropOffDetails: details });
                                this.setState({ dropOffAddress: data.description })
                            }}
                            
                            getDefaultValue={() => ''}
                            
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs',
                                language: 'en', // language of the results
                                // types: '(cities)' // default: 'geocode'
                            }}
                            
                            styles={{
                                textInputContainer: {
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    borderWidth: 0,
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    height: 40,
                                    borderRadius: 10,
                                    borderWidth: 0.5,
                                },
                                description: {
                                    fontWeight: 'bold'
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                }
                            }}
                            
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                types: 'store'
                            }}
                        
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        
                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        />

                        <Button block style={{ margin: 15 }} onPress={() => {this.postOrderInfo()}}>
                            <Text>Continue</Text>
                        </Button>


                        {/* <Form style={{marginTop: 30}}>
                            <Item floatingLabel>
                                <Label>Pickup Address</Label>
                                <Input 
                                    onChangeText={(text) => this.setState({pickupAddress: text})}
                                    value={this.props.navigation.getParam('location','')}
                                    returnKeyType={'next'} />
                            </Item>
                            <Item floatingLabel last>
                                <Label>Drop-off Address</Label>
                                <Input 
                                    onChangeText={(text) => this.setState({dropOffAddress: text})}
                                    // onFocus={() => this.getPlaces()}
                                    value={this.state.dropOffAddress}
                                    returnKeyType={'done'}
                                    onSubmitEditing={() => {this.postOrderInfo()}}/>
                            </Item>
                            <Content>
                                <Text style={{fontSize: 15, fontWeight: 'bold', margin: 10}}>Suggestions</Text>
                                <ScrollView scrollEventThrottle={16}>
                                    {this.state.pickupSuggestions}
                                    <List dataArray={this.state.pickupSuggestions}
                                        renderRow={(item) =>
                                        <ListItem>
                                            <Text>{item}</Text>
                                        </ListItem>
                                        }>
                                    </List>
                                </ScrollView>
                            </Content>
                        </Form> */}
                        {/* <Button block style={{ margin: 15 }} onPress={() => {this.postOrderInfo()}}>
                            <Text>Continue</Text>
                        </Button> */}
                    </Content>
                </Container>
            </Root>
        );
    }
}
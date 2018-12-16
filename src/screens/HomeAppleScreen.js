import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Button, Icon, Text, Header, Left, Container, Body, Right, Card, CardItem } from 'native-base';
import Geocoder from 'react-native-geocoding';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Geocoder.init('AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs');

export default class HomeAppleScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialPosition: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            marker: {
                latitude: 0,
                longitude: 0,
            },
            firstLaunch: null
        };
    }

    watchID: ?number = null;

    static navigationOptions = {
        title: 'Home',
        header: null
    };

    onMapPress(e) {
        this.setState({marker: e.nativeEvent.coordinate});
        this.marker1.showCallout();
    }

    initiateLocationPickup() {
        let address = 'none'
        let lat = this.state.marker.latitude;
        let long = this.state.marker.longitude;
        Geocoder.from(lat, long)
        .then(json => {
            address = json.results[0].formatted_address;
            this.props.navigation.navigate('RequestPickup', { location: address, lat: lat, long: long });
            console.log(address);
        })
        .catch(error => console.warn(error));
        
    }

    renderProfileShortcut() {
        if (this.state.firstLaunch == true) {
            return (
                <Card style={styles.firstLaunchCard}>
                    <Button transparent style={styles.firstLaunchCardButtonExit} onPress={() => this.setState({firstLaunch:false})}>
                        <Icon name='close' type='FontAwesome' style={{ fontSize: 20 }}/>
                    </Button>
                    <Text>Enter Information for a more convenient experience!</Text>

                    <Button bordered style={styles.firstLaunchCardButtonProfile} onPress={() => {this.props.navigation.navigate('Profile')}}>
                        <Text>Go To Profile</Text>
                    </Button>
                </Card>
            )
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({initialPosition:initialRegion});
            this.setState({markerPosition:initialRegion});
        }, (error) => alert(JSON.stringify(error)), 
        //{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var lastRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({initialPosition:lastRegion});
            this.setState({markerPosition:lastRegion});
        });

        AsyncStorage.getItem("alreadyLaunched").then(value => {
            if (value == null) {
                 AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
                 this.setState({firstLaunch: true});
            }
            else {
                 this.setState({firstLaunch: false});
            }
        }) // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
        return (
            <Container>
                <MapView
                    mapType={'mutedStandard'}
                    style={styles.map}
                    initialRegion={this.state.initialPosition}
                    //region={this.state.initialPosition}
                    onRegionChangeComplete={(region) => {
                        console.log('hey', this.state.initialPosition.latitudeDelta);
                    }}
                    onPress={(e) => this.onMapPress(e)}>
                    
                    <Marker
                        coordinate={this.state.marker}
                        calloutOffset={{ x: -8, y: 48 }}
                        ref={ref => { this.marker1 = ref; }}
                        onCalloutPress={(e) => {this.initiateLocationPickup()}}>

                            <Callout 
                                tooltip 
                                style={styles.customView}>
                                <View style={styles.container}>
                                    <View style={styles.bubble}>
                                        <View style={styles.amount}>
                                            <Text>Pickup Here</Text>
                                        </View>
                                    </View>
                                </View>
                            </Callout>
                            
                    </Marker>

                </MapView>

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

                {/* change to cardItem button */}
                <Card style={styles.mainCard}>
                    <CardItem style={styles.mainCardItem}>  
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => {this.props.navigation.navigate('RequestPickup', { location: 'hey' })}}>
                            <Icon type='Feather' name='package' style={{fontSize: 25, color: 'black'}}/>
                            <Text style={styles.text}>Where's the Pickup?</Text>
                        </TouchableOpacity>
                    </CardItem>

                    <CardItem style={styles.homeCardItem}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => {this.props.navigation.navigate('RequestPickup', { location: 'hi' })}}>
                            <Icon type='Feather' name='home' style={{fontSize: 22, color: 'black'}}/>
                            <Text style={styles.textMini}>Home</Text>
                        </TouchableOpacity>
                    </CardItem>
                </Card>

                {this.renderProfileShortcut()}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mainCard: {
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainCardItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
    },
    homeCardItem: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonStyle: {
        flex: 1, 
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    text: {
        marginLeft: 15,
        textAlign: 'center',
        color: 'grey'
    },
    textMini: {
        marginLeft: 15,
        textAlign: 'center',
        color: 'grey',
        fontSize: 14,
    },
    customView: {
        width: 140,
        height: 100,
    },
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    bubble: {
        width: 140,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        borderColor: '#000',
        borderWidth: 0.5,
    },
    amount: {
        flex: 1,
    },
    firstLaunchCard: {
        marginTop: 100,
        marginLeft: 60,
        marginRight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    firstLaunchCardButtonProfile: {
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    // firstLaunchCardButtonPayment: {
    //     // alignSelf: 'flex-end',
    //     marginTop: 20,
    //     // marginRight: 10,
    //     marginBottom: 20
    // },
    firstLaunchCardButtonExit: {
        alignSelf: 'flex-end'
    },
    // firstLaunchCardButtonContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // }
});

//     watchID: ?number = null;

//     static navigationOptions = {
//         title: 'Home',
//         header: null
//     };

//     componentDidMount() {
//         navigator.geolocation.getCurrentPosition((position) => {
//             var lat = parseFloat(position.coords.latitude);
//             var long = parseFloat(position.coords.longitude);

//             var initialRegion = {
//                 latitude: lat,
//                 longitude: long,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421
//             }

//             this.setState({initialPosition:initialRegion});
//             this.setState({markerPosition:initialRegion});
//         }, (error) => alert(JSON.stringify(error)), 
//         {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})
//         this.watchID = navigator.geolocation.watchPosition((position) => {
//             var lat = parseFloat(position.coords.latitude);
//             var long = parseFloat(position.coords.longitude);

//             var lastRegion = {
//                 latitude: lat,
//                 longitude: long,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421
//             }

//             this.setState({initialPosition:lastRegion});
//             this.setState({markerPosition:lastRegion});
//         })
//     }

//     componentWillUnmount() {
//         navigator.geolocation.clearWatch(this.watchID);
//     }

//     render() {
//         return (
//             <Container>
//                 <MapView
//                     style={styles.map}
//                     mapType={'mutedStandard'}
//                     region={this.state.initialPosition}>
//                     <MapView.Marker
//                         coordinate={this.state.markerPosition}
//                         title='yo'
//                         description='yep'/>
//                 </MapView>

//                 <Header transparent>
//                     <Left>
//                         <Button transparent onPress={() => {this.props.navigation.openDrawer()}}>
//                             <Icon name='menu' style={{fontSize: 35, color: 'black'}}/>
//                         </Button>
//                     </Left>
//                     <Body>
//                         {/* nothing */}
//                     </Body>
//                     <Right>
//                         {/* nothing */}
//                     </Right>
//                 </Header>

//                 <Card style={styles.mainCard}>
//                     <CardItem style={styles.mainCardItem}>
//                         <TouchableOpacity style={styles.buttonStyle} onPress={() => {this.props.navigation.openDrawer()}}>
//                             <Icon type='Feather' name='package' style={{fontSize: 25, color: 'black'}}/>
//                             <Text style={styles.text}>Where's the Pickup?</Text>
//                         </TouchableOpacity>
//                     </CardItem>

//                     <CardItem style={styles.homeCardItem}>
//                         <TouchableOpacity style={styles.buttonStyle} onPress={() => {this.props.navigation.openDrawer()}}>
//                             <Icon type='Feather' name='home' style={{fontSize: 22, color: 'black'}}/>
//                             <Text style={styles.textMini}>Home</Text>
//                         </TouchableOpacity>
//                     </CardItem>
//                 </Card>

                
//             </Container>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     map: {
//       ...StyleSheet.absoluteFillObject,
//     },
//     mainCard: {
//         marginTop: 40,
//         marginLeft: 20,
//         marginRight: 20,
//         height: 55,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     mainCardItem: {
//         borderBottomColor: 'grey',
//         borderBottomWidth: 0.5,
//     },
//     homeCardItem: {
//         borderBottomLeftRadius: 10,
//         borderBottomRightRadius: 10
//     },
//     body: {
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
//         alignItems: 'center'
//     },
//     buttonStyle: {
//         flex: 1, 
//         alignSelf: 'stretch',
//         backgroundColor: '#fff',
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
//         alignItems: 'center'
//     },
//     text: {
//         marginLeft: 15,
//         textAlign: 'center',
//         color: 'grey'
//     },
//     textMini: {
//         marginLeft: 15,
//         textAlign: 'center',
//         color: 'grey',
//         fontSize: 14,
//     },

// });
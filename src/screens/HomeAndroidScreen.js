import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { Button, Icon, Text, Header, Left, Container, Body, Right, Card, CardItem } from 'native-base';
import Geocoder from 'react-native-geocoding';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Geocoder.init('AIzaSyB0vyminAghtXy9gH6NIsAD1IXM0sxHvUs');

export default class HomeAndroidScreen extends Component {

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
        Geocoder.from(this.state.marker.latitude, this.state.marker.longitude)
        .then(json => {
            address = json.results[0].formatted_address;
            console.log(address);
        })
        .catch(error => console.warn(error));
        this.props.navigation.navigate('RequestPickup', { location: address });
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
        })
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
        return (
            <Container>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={this.state.initialPosition}
                    //region={this.state.initialPosition}
                    onRegionChangeComplete={(region) => {
                        console.log('hey', this.state.initialPosition.latitudeDelta);
                    }}
                    onPress={(e) => this.onMapPress(e)}>
                    
                    <Marker
                        coordinate={this.state.marker}
                        calloutAnchor={{ x: 0.5, y: 1 }}
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
});
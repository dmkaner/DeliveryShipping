import React, { Component } from "react";
import { Image, View } from "react-native";
import firebase from "react-native-firebase";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import styles from "./style";

const drawerCover = require("../../../assets/drawer-cover.png");
const userIcon = require("../../../assets/user.png");

const datas = [
  {
    name: "Home",
    route: "Home",
    icon: "home",
    bg: "#C5F442",
    type: "FontAwesome"
  },
  {
    name: "Your Pickups",
    route: "Pickups",
    icon: "truck-delivery",
    bg: "#477EEA",
    type: "MaterialCommunityIcons"
  },
  {
    name: "Add Payment",
    route: "AddPayment",
    icon: "credit-card",
    bg: "#DA4437",
    type: "FontAwesome"
  },
  {
    name: "Profile",
    route: "Profile",
    icon: "user",
    bg: "#C5F442",
    type: "Feather"
  },
  {
    name: "Help",
    route: "Help",
    icon: "help-circle",
    bg: "#C5F442",
    type: "Feather"
  },
  {
    name: "Sign Out",
    route: "SignOut",
    icon: "log-out",
    bg: "#C5F442",
    type: "Feather"
  }
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4, 
      dp: null
    };
  }

  getUrl() {
    try {
      const imageRef = firebase.storage().ref(firebase.auth().currentUser.uid).child("dp.jpg")
      imageRef.getDownloadURL().then(function(url) {
          this.setState({dp: url});
      }.bind(this)).catch((error)=> {console.log(error, 'no prof pic')});
    } catch (error) {
      console.log('user should be signed out', error);
    } 
  }

  render() {

    this.getUrl();

    const dpr = this.state.dp ? (
      <Image
          style={styles.drawerImage}
          source={{uri: this.state.dp}}
      />
    ) : (
      <Image square style={styles.drawerImage} source={userIcon} />
    )

    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          
          <View style={styles.drawerView}>
            {/* <Image square style={styles.drawerImage} source={userIcon} /> */}

            { dpr }

            <Text style={styles.userName}>Dylan Kane</Text>
          </View>
          

          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Icon
                    active
                    type={data.type}
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;

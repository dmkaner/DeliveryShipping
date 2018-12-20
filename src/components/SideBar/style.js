const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 6,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerView: {
    position: "absolute",
    flexDirection: 'row',
    left: Platform.OS === "android" ? deviceWidth / 35 : deviceWidth / 20,
    top: Platform.OS === "android" ? deviceHeight / 15 : deviceHeight / 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 25
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  userName: {
    fontWeight: Platform.OS === "ios" ? "400" : "300",
    fontSize: 20,
    color: 'white',
    marginLeft: 12
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }
};

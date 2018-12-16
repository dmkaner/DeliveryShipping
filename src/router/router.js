import { createStackNavigator, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import { Platform } from 'react-native';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeAppleScreen from '../screens/HomeAppleScreen';
import HomeAndroidScreen from '../screens/HomeAndroidScreen';
import RequestPickupScreen from '../screens/RequestPickupScreen';
import LogisticsScreen from '../screens/LogisticsScreen';
import StripeAndroidPayScreen from '../screens/StripeAndroidPayScreen';
import StripeApplePayScreen from '../screens/StripeApplePayScreen';
import HelpScreen from '../screens/HelpScreen';
import AddPaymentScreen from '../screens/AddPaymentScreen';
import PickupsScreen from '../screens/PickupsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignOutScreen from '../screens/SignOutScreen';
import SideBar from '../components/SideBar/SideBar';

export const SignedOut = createStackNavigator({
    SignUp: SignUpScreen,
    SignIn: SignInScreen
});

export const DeliveryStack = createStackNavigator({
    Home: Platform.select({
        ios: HomeAppleScreen,
        android: HomeAndroidScreen,
    }),
    RequestPickup: RequestPickupScreen,
    Logistics: LogisticsScreen,
    Payment: Platform.select({
        ios: StripeApplePayScreen,
        android: StripeAndroidPayScreen,
    })
});

export const SignedIn = createDrawerNavigator(
    {
        Home: DeliveryStack,
        Pickups: PickupsScreen,
        AddPayment: AddPaymentScreen,
        Profile: ProfileScreen,
        Help: HelpScreen,
        SignOut: SignOutScreen
    },
    {
        initialRouteName: 'Home',
        contentComponent: SideBar
    }
);

export const createRootNavigator = (signedIn = false) => {
    return createSwitchNavigator(
        {
            SignedIn: SignedIn,
            SignedOut: SignedOut
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
}

import React from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import SignUpPage from '../pages/SignUpPage';
import SignInPage from '../pages/SignInPage';
import color from '../colors'
import HomeStack from '../navigation/HomeStack';
import LocationsPage from '../pages/LocationsPage'

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerPosition="right"
            drawerStyle={{
                backgroundColor: color.headerBackground,
            }}
            drawerContentOptions={{
                activeTintColor: 'white',
                inactiveTintColor: color.text
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeStack}
            />
            <Drawer.Screen
                name="Sign In"
                component={SignInPage}
            />
            <Drawer.Screen
                name="Sign Up"
                component={SignUpPage}
            />
            <Drawer.Screen
                name="Locations"
                component={LocationsPage}
            />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator

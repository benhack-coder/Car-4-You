import React from 'react';
import color from "../colors.json";
import StackNavigator from "./StackNavigator";
import {createDrawerNavigator} from "@react-navigation/drawer";
import HomeStack from '../navigation/HomeStack';
import LocationsPage from "../pages/LocationsPage"
import FavouritePage from "../pages/FavouritePage"

const Drawer = createDrawerNavigator();

function DrawerNavigatorLoggedIn() {
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
            <Drawer.Screen name="Home" component={HomeStack}/>
            <Drawer.Screen name="Profile" component={StackNavigator}/>
            <Drawer.Screen name="Favourites" component={FavouritePage}/>
            <Drawer.Screen name="Locations" component={LocationsPage}/>
        </Drawer.Navigator>
    )
}

export default DrawerNavigatorLoggedIn

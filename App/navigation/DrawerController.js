import React from 'react'
import DrawerNavigator from './DrawerNavigator';
import DrawerNavigatorLoggedIn from "./DrawerNavigatorLoggedIn";
import {createStackNavigator} from '@react-navigation/stack';

function DrawerController() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false
            }}
        >
            <Stack.Screen name="Guest" component={DrawerNavigator}/>
            <Stack.Screen name="LoggedIn" component={DrawerNavigatorLoggedIn}/>
        </Stack.Navigator>
    )
}

export default DrawerController

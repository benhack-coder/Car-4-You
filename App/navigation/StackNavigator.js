import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import OfferCarPage from '../pages/OfferCarPage';
import ProfilePage from '../pages/ProfilePage';
import color from '../colors.json';
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";

const Stack = createStackNavigator();

function StackNavigator() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: color.text
                }
            }}
        >
            <Stack.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Home"
                component={HomePage}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Offer Car"
                component={OfferCarPage}
            />
            <Stack.Screen
                name="Sign Up"
                component={SignUpPage}
                options={{
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    )
}

export default StackNavigator

import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import color from '../colors.json';
import HomePage from "../pages/HomePage";
import InfoPage from "../pages/InfoPage";
import OwnerSpecsPage from "../pages/OwnerSpecsPage";
import DatePickerPage from "../pages/DatePickerPage";
import FilterPage from "../pages/FilterPage";
import ModelsPage from "../pages/ModelsPage";
import FilterMenuPage from "../pages/FilterMenuPage"
import ResultsPage from "../pages/ResultsPage"
import RatingPage from "../pages/RatingPage"
import RatingsOverViewPage from "../pages/RatingsOverViewPage";
import SearchPage from "../pages/SearchPage";
import ViewProfilePage from "../pages/ViewProfilePage"

function HomeStack() {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Home"
                         screenOptions={{
                             headerStyle: {
                                 backgroundColor: color.text
                             }
                         }}
        >
            <Stack.Screen
                name="Info"
                component={InfoPage}
                options={{
                    headerShown: true
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
                name="Owner"
                component={OwnerSpecsPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="DatePicker"
                component={DatePickerPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Filter"
                component={FilterPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Models"
                component={ModelsPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="FilterMenuPage"
                component={FilterMenuPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Results"
                component={ResultsPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Rating"
                component={RatingPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="All Ratings"
                component={RatingsOverViewPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Search items"
                component={SearchPage}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="View Profile"
                component={ViewProfilePage}
                options={{
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    )
}

export default HomeStack

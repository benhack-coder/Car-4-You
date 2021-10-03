import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerController from './navigation/DrawerController';

export default function App() {
    global.token = 'guest';
    return (
        <NavigationContainer>
            <DrawerController />
        </NavigationContainer>
    )
}

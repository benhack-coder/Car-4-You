import React, {useEffect, useRef} from "react";
import Navbar from "../components/Navbar";
import {ScrollView, Animated, AsyncStorage} from "react-native";
import color from "../colors.json"
import {useNavigation} from '@react-navigation/native';
import {Tile} from "react-native-elements";
import {login} from "../api";


function HomePage() {
    const navigation = useNavigation();


    const makeRequest = async (username, password) => {
        const response = await login(username, password)
        if (response === 1) {
            navigation.navigate("LoggedIn");

        } else {
            navigation.navigate("Guest");
        }
    }
    const retrieveData = async () => {
        try {
            const username = await AsyncStorage.getItem('username');
            const password = await AsyncStorage.getItem('password')
            if (username !== null && password !== null) {
                makeRequest(username, password)
            } else {
                global.token = 'guest';
                navigation.navigate("Guest");
            }
        } catch (error) {
            alert("could not login")
            global.token = 'guest';
            navigation.navigate("Guest");
        }
    };

    useEffect(() => {
        retrieveData();
    }, [])

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim]);

    return (
        <ScrollView
            style={{
                backgroundColor: color.background
            }}
        >
            <Navbar/>

            <Animated.View
                style={{
                    opacity: fadeAnim
                }}
            >
                <Tile
                    featured
                    imageSrc={require('../docs/image/mercedeslogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "mercedes"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/audilogo.png')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "audi"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/bmwlogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "bmw"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/lamborghinilogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "lamborghini"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/vwlogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "volkswagen"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/teslalogo.png')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "tesla"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/hyundailogo.png')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "hyundai"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/toyotalogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "toyota"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/hondalogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "honda"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/ferrarilogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "ferrari"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/porschelogo.jpg')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "porsche"})}
                />
                <Tile
                    featured
                    imageSrc={require('../docs/image/bugattilogo.png')}
                    titleStyle={{
                        color: color.text,
                        fontSize: 50
                    }}
                    onPress={() => navigation.navigate("Filter", {brand: "bugatti"})}
                />
            </Animated.View>
        </ScrollView>
    )
}

export default HomePage;

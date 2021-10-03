import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, TextInput, View, Linking} from "react-native";
import {Button, Text, Icon} from "react-native-elements";
import {useNavigation, useRoute} from '@react-navigation/native';
import color from "../colors.json";
import SpinnerComponent from "../components/SpinnerComponent";
import {getOwnerData, sendEmail} from '../api';

function OwnerSpecsPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({})
    const [text, setText] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const data = await getOwnerData(route.params.ownerName)
            setUser(data)
            setLoading(false)
        }
        loadData();
    }, [])

    {
        return loading ? <SpinnerComponent isLoading={loading}/> :
            (
                <ScrollView
                    style={{
                        backgroundColor: color.background
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            h1
                            style={{
                                marginTop: 50,
                                color: color.text
                            }}
                        >
                            Owner
                        </Text>

                        <Text
                            style={{
                                marginTop: 50,
                                fontSize: 20,
                                color: color.text
                            }}
                        >
                            Username: {route.params.ownerName + '\n'}
                        </Text>

                        <TextInput
                            multiline={true}
                            placeholder={'Send a message here ...'}
                            placeholderTextColor={color.text}
                            onChangeText={text => {
                                setText(text);
                            }}
                            style={{
                                marginTop: 50,
                                width: 280,
                                padding: 10,
                                backgroundColor: color.headerBackground,
                                color: color.text
                            }}
                        />
                        <Button
                            containerStyle={{
                                marginTop: 10,
                                marginLeft: 180,
                            }}
                            buttonStyle={{
                                width: 100,
                                borderRadius: 25,
                                backgroundColor: color.buttonBackground,
                                color: color.text
                            }}
                            loadingProps={{
                                animating: true
                            }}
                            onPress={() => makeRequest(text, user, route.params.car, navigation, route.params.startDate, route.params.endDate, route.params.rentalPrice)}
                            title="Send"
                        />

                        {
                            telNumExists(user) ?

                                <View>
                                    <Text
                                        style={{
                                            marginTop: 50,
                                            marginBottom: 30,
                                            fontSize: 30,
                                            color: color.text
                                        }}
                                    >
                                        or just call {route.params.ownerName}
                                    </Text>
                                    < Icon
                                        name='phone'
                                        type='MaterialIcons'
                                        color='#f50'
                                        size={50}
                                        onPress={() => Linking.openURL(`tel:${user.telNum}`)}
                                    />
                                </View>
                                : null
                        }
                    </View>
                </ScrollView>
            )
    }
}

function telNumExists(user) {
    return !(user.telNum === null || user.telNum === '');
}

function setFirstLetterBig(car) {
    if (car.brand.charAt(0).toUpperCase() + car.brand.slice(1) === "Bmw") {
        return "BMW"
    } else {
        return car.brand.charAt(0).toUpperCase() + car.brand.slice(1)
    }
}

async function makeRequest(text, user, car, navigation, startDate, endDate, price) {
    const response = await sendEmail(text, user, setFirstLetterBig(car) + " " + car.model, startDate, endDate, price)
    if (response === 0) {
        Alert.alert("Could not be send")
    } else {
        Alert.alert("Sent")
        navigation.navigate("Home")
    }
}

export default OwnerSpecsPage

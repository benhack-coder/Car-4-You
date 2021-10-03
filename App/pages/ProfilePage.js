import React, {useEffect, useRef, useState} from 'react'
import {Alert, Animated, ScrollView, Text, TextInput, View, AsyncStorage} from 'react-native';
import NoFilterNavbar from "../components/NoFilterNavbar";
import {Avatar, Button, Icon} from "react-native-elements";
import {useNavigation} from '@react-navigation/native';
import color from "../colors.json";
import axios from "axios";
import ProfileCar from '../components/ProfileCar';
import config from '../config.json';
import SpinnerComponent from "../components/SpinnerComponent";
import {getCarData, getProfileData, postUserTelNum, deleteUserAccount} from "../api/index"

function ProfilePage() {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [firstLetter, setFirstLetter] = useState("");
    const [cars, setCars] = useState([]);
    const [loading2, setLoading2] = useState(true);
    const [tel, setTel] = useState('Tel. Number: ');

    const mail = 'Email: ';
    const username = 'Username: ';

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            setLoading2(true)
            const carData = await getCarData();
            setCars(carData)
            setLoading2(false)
        });
    }, [navigation])

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            setLoading(true)
            const profileData = await getProfileData();
            setData(profileData)
            setFirstLetter(profileData.userName.charAt(0))
            setLoading(false)

        })
    }, [navigation])

    const slide = useRef(new Animated.Value(-500)).current;

    useEffect(() => {
        Animated.timing(
            slide,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }, [slide]);

    const refresh = async () => {
        setLoading2(true)
        const carData = await getCarData();
        setCars(carData)
        setLoading2(false)
    }

    const deleteAccount = async () => {
        const data = await deleteUserAccount()
        if (data === 1) {
            alert("Successfully deleted your entire account and data")
            navigateHome(navigation)
        } else {
            alert("Something went wrong. Try again later")
        }
    }

    const deleteAlert = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? All data will be wiped",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {text: "OK", onPress: () => deleteAccount()}
            ]
        );
    }

    {
        return loading ? <SpinnerComponent isLoading={loading}/> : (
            <ScrollView
                style={{
                    backgroundColor: color.background,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <NoFilterNavbar/>

                    <Avatar
                        activeOpacity={0.2}
                        containerStyle={{
                            backgroundColor: "#BDBDBD",
                            marginTop: 15
                        }}
                        rounded
                        size="large"
                        title={firstLetter}
                    />

                    <TextInput
                        style={{
                            width: 300,
                            height: 50,
                            fontSize: 25,
                            color: color.text,
                        }}
                        placeholderTextColor={color.text}
                        placeholder={username + data.userName}
                        editable={false}
                    />

                    <TextInput
                        style={{
                            width: 300,
                            height: 50,
                            fontSize: 25,
                            color: color.text,
                        }}
                        placeholderTextColor={color.text}
                        placeholder={mail + data.eMail}
                        editable={false}
                    />

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >

                        <TextInput
                            style={{
                                width: 280,
                                height: 50,
                                fontSize: 25,
                                color: color.text,
                            }}
                            placeholderTextColor={color.text}
                            placeholder={"Tel: " + data.telNum}
                            keyboardType="numeric"
                            onChangeText={
                                (value) => setTel(value)
                            }
                        />


                        <Icon
                            style={{}}
                            name='edit'
                            type='AntDesign'
                            color='#f50'
                        />

                    </View>

                    <Button
                        buttonStyle={{
                            width: 150,
                            borderColor: color.border,
                            borderRadius: 100,
                            backgroundColor: color.buttonBackground
                        }}
                        containerStyle={{
                            marginTop: 30
                        }}
                        title='Save Changes'
                        titleStyle={{
                            marginHorizontal: 5,
                            color: '#FFF'
                        }}
                        type="outline"
                        onPress={() => update(data.userName, data.eMail, tel)}
                    />

                    <Button
                        buttonStyle={{
                            width: 150,
                            borderColor: color.border,
                            borderRadius: 100,
                            backgroundColor: color.buttonBackground
                        }}
                        containerStyle={{
                            marginTop: 30
                        }}
                        title='Log Out'
                        titleStyle={{
                            marginHorizontal: 5,
                            color: '#FFF'
                        }}
                        type="outline"
                        onPress={() => logOut(navigation)}
                    />

                    <Button
                        buttonStyle={{
                            width: 150,
                            borderColor: color.border,
                            borderRadius: 100,
                            backgroundColor: color.buttonBackground
                        }}
                        containerStyle={{
                            marginTop: 30
                        }}
                        onPress={() => deleteAlert()}
                        title="Delete my account"
                        titleStyle={{
                            marginHorizontal: 5,
                            color: '#FFF'
                        }}
                        type="outline"
                    />

                    <Button
                        buttonStyle={{
                            width: 150,
                            borderColor: color.border,
                            borderRadius: 100,
                            backgroundColor: color.buttonBackground
                        }}
                        containerStyle={{
                            marginTop: 30
                        }}
                        onPress={() => navigation.navigate("Offer Car")}
                        title="Offer a car"
                        titleStyle={{
                            marginHorizontal: 5,
                            color: '#FFF'
                        }}
                        type="outline"
                    />

                    <Text
                        h2
                        style={{
                            marginTop: 20,
                            fontSize: 20,
                            color: color.text
                        }}
                    >
                        Your Cars:
                    </Text>

                    {loading2 ? <Text style={{color: color.text, marginTop: "10%"}}>Loading...</Text> : (
                        cars.map((car) =>
                            <ProfileCar
                                key={car.id}
                                car={car}
                                refresh={() => refresh()}
                            />
                        ))}
                </View>
            </ScrollView>
        )
    }
}

function logOut(navigation) {
    let keys = ['username', 'password']
    AsyncStorage.multiRemove(keys, (err) => {

    })
    const headers = {
        Authorization: global.token
    }

    axios.get(config.userAPI + config.logout, {headers})
        .then(r => {
            if (r.data === 1) {
                navigateHome(navigation);
                Alert.alert("Logout Successful")
            }
        })
}

function navigateHome(navigation) {
    global.token = "guest";
    navigation.navigate('Guest');
}

async function update(username, email, telNum) {
    const response = await postUserTelNum(username, email, telNum)
    if (response === 0) {
        Alert.alert("Something went Wrong!", "Try again!")
    } else {
        Alert.alert("Changes Saved")
    }
}

export default ProfilePage

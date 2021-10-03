import React, {useState, useEffect} from 'react';
import {ScrollView, View, TextInput, Platform, StyleSheet, Text} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Button, Image} from "react-native-elements";
import color from "../colors.json";
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import {getModelsByBrand, uploadCar} from "../api/index";

function OfferCarPage() {
    const [image, setImage] = useState('');
    const [displayImage, setDisplayImage] = useState(null);
    const [noPicture, setNoPicture] = useState(true);
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [location, setLocation] = useState('')
    const [year, setYear] = useState(null);
    const [fuel, setFuel] = useState('');
    const [km, setKm] = useState(0);
    const [dailyPrice, setDailyPrice] = useState(0);
    const [models, setModels] = useState(null)
    const navigation = useNavigation();
    const [modelArray, setModelArray] = useState([])

    useEffect(() => {
        (
            async () => {
                if (Platform.OS !== 'web') {
                    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                        alert('Sorry, we need camera roll permissions to make this work!');
                    }
                }
            })();
    }, []);//Image permission

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (!result.cancelled) {
            setImage(result.uri)
            setDisplayImage(result.uri)
            setNoPicture(false)
        }
    };

    const makeRequest = async () => {
        if (checkCarData(image, brand, model, location, year, fuel, km, dailyPrice)) {
            if (dailyPrice <= 1000) {
                const response = await uploadCar(image, brand, model, location, year, fuel, km, dailyPrice)
                if (response === 0) {
                    alert("Something went wrong")
                } else {
                    alert("Successfully uploaded")
                    navigation.goBack()
                }
            } else {
                alert("Daily price must be max. 1000$")
            }
        } else {
            alert("please fill everything in")
        }
    }

    const evalModels = () => {
        let processedModels = [];
        for (let i = 0; i < models.Results.length; i++) {
            const obj = {
                label: models.Results[i].Model_Name, value: models.Results[i].Model_Name, color: color.text
            }
            processedModels.push(obj)
        }
        setModelArray(processedModels);
    }

    useEffect(() => {
        const loadModels = async () => {
            const models = await getModelsByBrand(brand)
            setModels(models)
        }
        if (brand !== '') {
            loadModels()
        }
    }, [brand])

    useEffect(() => {
        if (models === null) return
        evalModels()
    }, [models])

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 20,
            fontWeight: "bold",
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: color.border,
            borderRadius: 4,
            color: color.text,
            paddingRight: 30,
            width: 300,
            height: 50,
            marginBottom: 10,
            marginLeft: 37, // to ensure the text is never behind the icon
        },
        inputAndroid: {
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: color.border,
            borderRadius: 8,
            color: color.text,
            paddingRight: 30,
            width: 300,
            height: 50,
            marginBottom: 10,
            marginLeft: 37// to ensure the text is never behind the icon
        },
    });

    return (
        <ScrollView
            style={{
                backgroundColor: color.background
            }}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: 20,
                    alignItems: "center",
                }}
            >
                <RNPickerSelect
                    placeholder={{
                        label: 'Select a brand...',
                        value: null,
                    }}
                    placeholderTextColor="black"
                    style={pickerSelectStyles}
                    onValueChange={value => setBrand(value)}
                    items={[
                        {label: 'Mercedes', value: 'mercedes', color: color.text},
                        {label: 'Audi', value: 'audi', color: color.text},
                        {label: 'BMW', value: 'bmw', color: color.text},
                        {label: 'Lamborghini', value: 'lamborghini', color: color.text},
                        {label: 'Volkswagen', value: 'volkswagen', color: color.text},
                        {label: 'Tesla', value: 'tesla', color: color.text},
                        {label: 'Hyundai', value: 'hyundai', color: color.text},
                        {label: 'Toyota', value: 'toyota', color: color.text},
                        {label: 'Honda', value: 'honda', color: color.text},
                        {label: 'Ferrari', value: 'ferrari', color: color.text},
                        {label: 'Porsche', value: 'porsche', color: color.text},
                        {label: 'Bugatti', value: 'bugatti', color: color.text}
                    ]}
                />

                <RNPickerSelect
                    placeholder={{
                        label: 'Select a model ...',
                        value: null,
                    }}
                    placeholderTextColor="black"
                    style={pickerSelectStyles}
                    onValueChange={
                        (value) => setModel(value)
                    }
                    items={modelArray}
                />

                <RNPickerSelect
                    placeholder={{
                        label: 'Select a location ...',
                        value: null,
                    }}
                    placeholderTextColor="black"
                    style={pickerSelectStyles}
                    onValueChange={
                        (value) => setLocation(value)
                    }
                    items={[
                        {label: 'Zurich', value: 'Zurich', color: color.text},
                        {label: 'Lachen', value: 'Lachen', color: color.text},
                        {label: 'Wolfhausen', value: 'Wolfhausen', color: color.text},
                        {label: 'Hombrechtikon', value: 'Hombrechtikon', color: color.text},
                        {label: 'Basel', value: 'Basel', color: color.text},
                        {label: 'Lugano', value: 'Lugano', color: color.text},
                    ]}
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Fill in the year ..."
                    keyboardType="numeric"
                    onChangeText={
                        (value) => setYear(value)
                    }
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Fill in the fuel ..."
                    onChangeText={
                        (value) => setFuel(value)
                    }
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Fill in the km ..."
                    keyboardType="numeric"
                    onChangeText={
                        (value) => setKm(value)
                    }
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Fill in the daily Price ..."
                    keyboardType="numeric"
                    onChangeText={
                        (value) => setDailyPrice(value)
                    }
                />

                <Button
                    buttonStyle={{
                        borderWidth: 1,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text
                    }}
                    title="Upload Image"
                    titleStyle={{
                        marginHorizontal: 5,
                        color: color.text
                    }}
                    onPress={pickImage}
                />

                {
                    noPicture ? <Text style={{color: color.text, marginTop: "10%"}}>choose a picture...</Text> : (
                        <Image
                            source={{uri: displayImage}}
                            style={{
                                width: 300, height: 200,
                                overflow: "hidden",
                                borderTopWidth: -1,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderLeftWidth: 1,
                                borderColor: color.border
                            }}
                        />
                    )
                }

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
                    onPress={() => makeRequest()}
                    title="Offer Now"
                    titleStyle={{
                        marginHorizontal: 5,
                        color: color.text
                    }}
                />
            </View>
        </ScrollView>
    );
}

export default OfferCarPage

function checkCarData(image, brand, model, year, fuel, km, dailyPrice, location) {
    return (image !== '' && model !== '' && year !== null && fuel !== '' && km !== 0 && dailyPrice !== 0 && location !== null)
}

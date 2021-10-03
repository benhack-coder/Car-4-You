import React, {useState} from 'react'
import {View, Text, ScrollView, TextInput, StyleSheet, Alert} from "react-native";
import {Slider, Icon, Button} from "react-native-elements";
import color from "../colors.json"
import {useNavigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

function FilterMenuPage() {
    const [price, setPrice] = useState(0)
    const [km, setKm] = useState("")
    const [location, setLocation] = useState("")
    const navigation = useNavigation();

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
        <ScrollView style={{
            backgroundColor: color.background
        }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 30,
                    alignItems: "center"
                }}
            >
                <Text
                    h1
                    style=
                        {{
                            color: color.text,
                            fontSize: 30
                        }}
                >
                    Daily Price: {price}$

                </Text>

                <Text
                    h1
                    style=
                        {{
                            color: color.text,
                            fontSize: 30
                        }}
                >
                    Km: {km}

                </Text>

                <Text
                    h1
                    style=
                        {{
                            color: color.text,
                            fontSize: 30
                        }}
                >
                    Location: {location}

                </Text>

                <Slider
                    animateTransitions
                    animationType="timing"
                    maximumTrackTintColor="#ccc"
                    maximumValue={1000}
                    minimumTrackTintColor="#222"
                    minimumValue={0}
                    onValueChange={value => setPrice(value)}
                    orientation="horizontal"
                    step={10}
                    style={{width: "80%", height: 200}}
                    thumbStyle={{height: 20, width: 20}}
                    thumbProps={{
                        children: (
                            <Icon
                                name="dollar"
                                type="font-awesome"
                                size={20}
                                reverse
                                containerStyle={{bottom: 20, right: 20}}
                                color="#4E72DE"
                            />
                        )
                    }}
                    thumbTintColor="#0c0"
                    thumbTouchSize={{width: 20, height: 20}}
                    trackStyle={{height: 10, borderRadius: 20}}
                    value={50}
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 25,
                        fontWeight: "100",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Km"
                    keyboardType="numeric"
                    onChangeText={
                        (value) => setKm(value)
                    }
                />


                <RNPickerSelect
                    placeholder={{
                        label: 'Select a location...',
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

                <Button
                    buttonStyle={{
                        width: 150,
                        borderColor: color.border,
                        borderRadius: 100,
                        backgroundColor: color.buttonBackground
                    }}
                    containerStyle={{
                        margin: 5
                    }}
                    loadingProps={{
                        animating: true
                    }}
                    onPress={() => {
                        if (km || location || price) {
                            navigation.navigate("Results", {price: price, km: km, location: location})
                        } else {
                            Alert.alert("You need to select at least one attribute")
                        }
                    }}
                    title="Search"
                    titleStyle={{
                        marginHorizontal: 5,
                        color: color.text
                    }}

                    type="outline"
                />
            </View>
        </ScrollView>
    );

}

export default FilterMenuPage

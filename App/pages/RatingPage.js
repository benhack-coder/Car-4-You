import React, {useState} from 'react';
import {ScrollView, View, TextInput, Alert} from 'react-native';
import color from "../colors.json";
import {Button, AirbnbRating} from "react-native-elements";
import {useNavigation, useRoute} from "@react-navigation/native";
import {postRating} from '../api';

export default function RatingPage() {
    const [rating, setRating] = useState(0)
    const [text, setText] = useState('')
    const route = useRoute();
    const navigation = useNavigation();


    const submitRating = async () => {
        if (text !== '' && rating !== 0) {
            const response = await postRating(rating, text, route.params.id)
            if (response === 0) {
                Alert.alert("Something went wrong")
            } else {
                Alert.alert("Review added")
                navigation.goBack();
            }
        } else {
            Alert.alert("You need to enter a text and select an amount of stars")
        }
    }

    return (
        <ScrollView style={{
            backgroundColor: color.background
        }}>
            <View style={{
                flex: 1,
                paddingTop: 40,
                alignItems: "center"
            }}>
                <AirbnbRating
                    count={5}
                    defaultRating={0}
                    reviews={[
                        "Terrible",
                        "Bad",
                        "Okay",
                        "Good",
                        "Great"
                    ]}
                    showRating
                    onFinishRating={value => setRating(value)}
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
                        marginTop: 20,
                        fontSize: 25,
                        fontWeight: "100",
                        color: color.text
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Text"
                    onChangeText={
                        (value) => setText(value)
                    }
                />
                <Button buttonStyle={{
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
                            submitRating();
                        }}
                        title="Submit"
                        titleStyle={{
                            marginHorizontal: 5,
                            color: color.text
                        }}

                        type="outline"
                />
            </View>
        </ScrollView>
    )
}



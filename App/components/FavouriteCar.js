import React from 'react'
import {ScrollView, View, Alert} from "react-native";
import {Tile} from "react-native-elements";
import color from "../colors.json"
import {Icon} from 'react-native-elements';
import {deleteFavourite} from "../api/index"

function ProfileCar(props) {

    const removeCar = async () => {
        const response = await deleteFavourite(props.car.id)
        if (response === 0) {
            alert("Something went wrong")
        } else {
            alert("Removed")
            props.refresh()
        }
    }

    const deleteAlert = () =>
        Alert.alert(
            "Are you sure you want to remove from your favourites:",
            props.car.brand + " " + props.car.model,
            [
                {
                    text: "Yes",
                    onPress: () => removeCar(props.car.id)
                },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ],
            {cancelable: false}
        );

    const setBMWBig = () => {
        if (props.car.brand.charAt(0).toUpperCase() + props.car.brand.slice(1) === "Bmw") {
            return "BMW"
        } else {
            return props.car.brand.charAt(0).toUpperCase() + props.car.brand.slice(1)
        }
    }

    return (
        <ScrollView>
            <Tile
                imageSrc={{uri: props.car.imageUrl}}
                title={setBMWBig() + " " + props.car.model}
                titleStyle={{color: color.text,}}
                contentContainerStyle={{height: 80, borderWidth: 1, borderColor: color.border, marginBottom: 10}}
                onPress={props.onClick}
            >
                <View
                    style=
                        {{
                            flex: 1,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                        }}
                >
                    <Icon
                        style={{}}
                        name='delete-forever'
                        type='MaterialIcons'
                        color='#f50'
                        onPress={() => deleteAlert()}

                    />
                </View>
            </Tile>
        </ScrollView>
    )
}

export default ProfileCar



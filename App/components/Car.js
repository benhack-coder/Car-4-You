import React from 'react'
import {ScrollView, View} from "react-native";
import {Tile} from "react-native-elements";
import color from "../colors.json"

function Car(props) {

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
                titleStyle={{color: color.text}}
                onPress={props.onClick}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
            </View>
        </ScrollView>
    )
}

export default Car

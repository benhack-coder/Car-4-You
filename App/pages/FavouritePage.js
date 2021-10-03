import React, {useEffect, useState} from 'react'
import NoFilterNavbar from "../components/NoFilterNavbar";
import {ScrollView, Text, View} from "react-native";
import color from "../colors.json";
import NoCarsFound from "../components/NoCarsFound.";
import {getModelsByFavourite} from '../api';
import FavouriteCar from "../components/FavouriteCar";
import SpinnerComponent from "../components/SpinnerComponent";
import {useNavigation} from '@react-navigation/native';


function favouritePage() {

    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            setLoading(true)
            const data = await getModelsByFavourite()
            setModels(data)
            setLoading(false)
        })
    }, [navigation])

    const refresh = async () => {
        setLoading(true)
        const data = await getModelsByFavourite()
        setModels(data)
        setLoading(false)
    }

    return (
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
                <NoFilterNavbar/>

                <Text
                    style={{
                        marginTop: 20,
                        fontSize: 20,
                        color: color.text
                    }}
                >
                    Your Favourite cars:
                </Text>

                {loading ? <SpinnerComponent isLoading={loading}/> : models.length === 0 ? <NoCarsFound/> : (
                    models.map((car) =>
                        <FavouriteCar
                            key={car.id}
                            car={car}
                            refresh={() => refresh()}
                            onClick={() => navigation.navigate("Home", {
                                screen: "Info",
                                params: {itemId: car.id, data: car}
                            })}
                        />
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default favouritePage


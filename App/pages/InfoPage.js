import React, {useEffect, useRef, useState} from 'react'
import {Alert, Animated, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import color from '../colors.json';
import {Button, Icon, Image, PricingCard} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import AvgRatingComponent from "../components/AvgRatingComponent"
import {addFavourite, fetchRatings} from "../api/index"

function InfoPage() {

    const setBMWBig = () => {
        if (route.params.data.brand.charAt(0).toUpperCase() + route.params.data.brand.slice(1) === "Bmw") {
            return "BMW"
        } else {
            return route.params.data.brand.charAt(0).toUpperCase() + route.params.data.brand.slice(1)
        }
    }

    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true)
    const [ratings, setRatings] = useState([])
    const title = setBMWBig() + " " + route.params.data.model
    const price = route.params.data.dailyPrice + "$/Day"
    const km = route.params.data.km + " km"
    const year = route.params.data.year
    const fuel = route.params.data.fuel

    const slide = useRef(new Animated.Value(-500)).current;


    const goToRating = () => {
        if (global.token === 'guest') {
            Alert.alert("You need to be logged in to submit a rating")
            navigation.navigate("Sign In")
        } else {
            navigation.navigate("Rating", {id: route.params.data.id})
        }
    }

    const goToContact = () => {
        if (global.token !== 'guest') {
            navigation.navigate("DatePicker", {
                ownerName: route.params.data.owner,
                car: route.params.data
            })
        } else {
            alert("You need to be logged in to contact an owner")
            navigation.navigate("Sign In")
        }
    }

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            setLoading(true)
            const data = await fetchRatings(route.params.data.id);
            setRatings(data)
            setLoading(false)
        })
    }, [navigation]);

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

    const addToFavourites = async () => {
        const response = await addFavourite(route.params.data.id)
        if (response === 'success') {
            Alert.alert("Added to your favourites")
        } else if (response === "already liked") {
            Alert.alert("You already added this car to your favourites")
        } else {
            Alert.alert("Something went wrong")
        }
    }

    return (
        <ScrollView style={{
            backgroundColor: color.background
        }}>
            <Image
                source={{
                    uri: route.params.data.imageUrl
                }}
                style={{
                    height: 300,
                    width: 450,
                }}/>

            <Animated.View
                style={{
                    flex: 1,
                    alignItems: "center",
                    transform: [{
                        translateX: slide
                    }
                    ]
                }}
            >
                <PricingCard
                    containerStyle={{marginTop: 25}}
                    color="#4f9deb"
                    title={title}
                    price={price}
                    info={[km, year, fuel]}
                    button={{
                        title: 'Contact owner',
                        icon: 'person'
                    }}
                    onButtonPress={() => goToContact()}
                />


                <View style={{flexDirection: "row"}}>
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
                                goToRating();
                            }}
                            title="Add Rating"
                            titleStyle={{
                                marginHorizontal: 5,
                                color: color.text
                            }}

                            type="outline"
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
                                navigation.navigate("All Ratings", {ratings: ratings})
                            }}
                            title="See all Ratings"
                            titleStyle={{
                                marginHorizontal: 5,
                                color: color.text
                            }}

                            type="outline"
                    />

                </View>

                {global.token !== 'guest' ? <Icon
                    reverse
                    name='favorite'
                    type='material'
                    color="#e81a1a"
                    onPress={() => addToFavourites()}
                /> : <Text style={{
                    marginTop: 20,
                    fontSize: 20,
                    color: color.text
                }}>Login to add this car to your favourites</Text>}

                {loading ? <Text style={{
                    marginTop: 20,
                    fontSize: 20,
                    color: color.text
                }}>Loading ratings...</Text> : ratings.length === 0 ? <Text h2
                                                                            style={{
                                                                                marginTop: 20,
                                                                                fontSize: 20,
                                                                                color: color.text
                                                                            }}>No ratings for this car</Text> : (
                    <AvgRatingComponent ratings={ratings}/>
                )}
            </Animated.View>
        </ScrollView>
    )
}

export default InfoPage

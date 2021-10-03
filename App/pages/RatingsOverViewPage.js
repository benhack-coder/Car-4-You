import React from 'react'
import {ScrollView, View, Text} from 'react-native'
import {useRoute} from '@react-navigation/native';
import color from "../colors.json";
import RatingComponent from "../components/RatingComponent"

function RatingsOverViewPage() {
    const route = useRoute();
    const ratings = route.params.ratings;
    return (
        <ScrollView style={{
            backgroundColor: color.background
        }}>
            <View style={{
                flex: 1,
                paddingTop: 40,
                alignItems: "center"
            }}>
                {ratings.length === 0 ? <Text h2
                                              style={{
                                                  marginTop: 20,
                                                  fontSize: 20,
                                                  color: color.text
                                              }}>No ratings yet</Text> : (
                    ratings.map((rating) =>
                        <RatingComponent key={rating.text} rating={rating}/>
                    ))}
            </View>
        </ScrollView>
    )
}

export default RatingsOverViewPage

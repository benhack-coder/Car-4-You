import React from 'react'
import {ScrollView, View} from 'react-native'
import {AirbnbRating} from "react-native-elements";

function AvgRatingComponent(props) {
    let total = 0;
    for (let i = 0; i < props.ratings.length; i++) {
        total += props.ratings[i].numStars
    }
    let avg = Math.round(total / props.ratings.length);
    return (
        <ScrollView>
            <View>
                <AirbnbRating
                    count={5}
                    defaultRating={avg}
                    reviews={[
                        "Terrible",
                        "Bad",
                        "Okay",
                        "Good",
                        "Great"
                    ]}
                    showRating
                    isDisabled
                />
            </View>
        </ScrollView>
    )
}

export default AvgRatingComponent

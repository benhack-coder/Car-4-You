import React from 'react'
import {ScrollView, View, Text} from 'react-native'
import {AirbnbRating, Divider} from "react-native-elements";
import color from "../colors.json"

function RatingComponent(props) {
    return (
        <ScrollView>
            <View>

                <AirbnbRating
                    count={5}
                    defaultRating={props.rating.numStars}
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
                <Text h2
                      style={{
                          marginTop: 20,
                          fontSize: 20,
                          color: color.text
                      }}
                >{props.rating.text} ~ {props.rating.userName}</Text>
                <Divider style={{marginTop: 20}}/>
            </View>
        </ScrollView>
    )
}

export default RatingComponent

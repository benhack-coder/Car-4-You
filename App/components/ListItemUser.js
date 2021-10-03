import React from 'react'
import {ScrollView, View} from "react-native"
import {Card, Button} from "react-native-elements"
import color from "../colors.json"
import {useNavigation} from '@react-navigation/native';


function ListItemUser(props) {

    const navigation = useNavigation();

    return (
        <ScrollView>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card onPress={() => console.log("test")}>
                    <Card.Title>{props.user.userName}</Card.Title>
                    <Card.Divider/>
                    <Card.FeaturedSubtitle
                        style={{
                            color: color.text,
                            width: 300,
                            height: 50,
                        }}>
                        {props.user.eMail}
                    </Card.FeaturedSubtitle>
                    <Button
                        style={{width: 300, height: 50}}
                        onPress={() => navigation.navigate('View Profile', {data: props.user})}
                        title="View Profile"
                        type="solid"
                    >
                    </Button>
                </Card>
            </View>
        </ScrollView>
    )
}

export default ListItemUser

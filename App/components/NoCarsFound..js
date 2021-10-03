import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, Button, View} from "react-native";
import {Card, Icon} from "react-native-elements";

export default function NoCarsFound() {
    const navigation = useNavigation();
    return (
        <ScrollView>
            <View>
                <Card containerStyle={{marginTop: "50%"}}>
                    <Card.Title>Oops... no cars found</Card.Title>
                    <Card.Divider/>
                    <Card.Image source={require('../docs/image/brokencar.png')}>
                    </Card.Image>
                    <Card.FeaturedSubtitle>
                        <Button
                            icon={<Icon name='code' color='#ffffff'/>}
                            buttonStyle={{borderRadius: 0, marginLeft: 50, marginRight: 0, marginBottom: 0}}
                            title='Go back' onPress={() => navigation.goBack()}/>
                    </Card.FeaturedSubtitle>
                </Card>
            </View>
        </ScrollView>
    );
};

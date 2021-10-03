import React from "react";
import {Button, Header, Icon} from "react-native-elements";
import {View} from "react-native";
import {useNavigation} from '@react-navigation/native';
import color from '../colors.json';


function NoFilterNavbar() {
    const navigation = useNavigation();
    return (
        <View>
            <Header
                backgroundColor={color.headerBackground}
                barStyle="default"
                centerComponent={
                    <Button
                        title="BEL"
                        type="clear"
                        titleStyle={{
                            color: 'white'
                        }}
                    />
                }
                containerStyle={{
                    alignSelf: "stretch"
                }}
                leftComponent={
                    <Icon
                        color="#FFF"
                        name="arrow-left"
                        onLongPress={() => console.log("FILTERLongPress")}
                        onPress={() => navigation.goBack()}
                        type="feather"
                    />
                }
                placement="center"
                rightComponent={
                    <Icon
                        color="#FFF"
                        name="menu"
                        onLongPress={() => console.log("MENULongPress")}
                        onPress={() => navigation.openDrawer()}
                        type="material"
                    />
                }
            />
        </View>
    );
}


export default NoFilterNavbar;
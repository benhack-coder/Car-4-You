import React from "react";
import {Header, Icon} from "react-native-elements";
import {View} from "react-native";
import {useNavigation} from '@react-navigation/native';
import color from '../colors.json';

function Navbar() {
    const navigation = useNavigation();

    return (
        <View>
            <Header
                backgroundColor={color.headerBackground}
                barStyle="default"
                centerComponent={
                    <Icon
                        color="#FFF"
                        name="search"
                        onLongPress={() => console.log("FILTERLongPress")}
                        onPress={() => navigation.navigate("Search items")}
                        type="feather"
                    />
                }
                containerStyle={{
                    alignSelf: "stretch"
                }}
                leftComponent={
                    <Icon
                        color="#FFF"
                        name="filter"
                        onLongPress={() => console.log("FILTERLongPress")}
                        onPress={() => navigation.navigate("FilterMenuPage")}
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


export default Navbar;

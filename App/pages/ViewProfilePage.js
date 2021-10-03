import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native';
import color from "../colors.json";
import {Avatar} from "react-native-elements";
import Car from "../components/Car"
import {getViewProfileCar} from "../api/index"

function ViewProfilePage() {

    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        const loadCars = async () => {
            const models = await getViewProfileCar(route.params.data.userName)
            setData(models);
            setLoading(false)
        }
        loadCars()
    }, [])

    return (

        <ScrollView
            style={{
                backgroundColor: color.background,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Avatar
                    activeOpacity={0.2}
                    containerStyle={{
                        backgroundColor: "#BDBDBD",
                        marginTop: 15
                    }}
                    onLongPress={() => alert("onLongPress")}
                    onPress={() => alert("onPress")}
                    rounded
                    size="large"
                    title={route.params.data.userName.charAt(0)}
                />
                <Text
                    style={{
                        width: 300,
                        height: 50,
                        fontSize: 25,
                        color: color.text,
                    }}
                >
                    Username: {route.params.data.userName}
                </Text>

                <Text
                    style={{
                        width: 300,
                        height: 50,
                        fontSize: 25,
                        color: color.text,
                    }}
                >
                    E-Mail: {route.params.data.eMail}
                </Text>

                <Text
                    style={{
                        width: 300,
                        height: 50,
                        fontSize: 25,
                        color: color.text,
                    }}
                >
                    offered cars:
                </Text>

                {loading ? <Text style={{color: color.text, marginTop: "10%"}}>Loading...</Text> : (data.length === 0 ?
                    <Text style={{color: color.text, marginTop: "5%", fontSize: 20}}>No cars yet uploaded</Text> : (
                        data.map((car) =>
                            <Car
                                key={car.id}
                                car={car}
                                onClick={() => navigation.navigate("Info", {data: car})}
                            />
                        )))}
            </View>
        </ScrollView>

    );
}

export default ViewProfilePage;

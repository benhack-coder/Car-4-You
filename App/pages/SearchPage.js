import React, {useState, useEffect} from 'react'
import {ScrollView} from 'react-native-gesture-handler'
import {View, Text, Switch, TextInput} from "react-native"
import color from "../colors.json"
import {getSearchData} from '../api'
import {getSearchUserData} from '../api'
import ListItemUser from '../components/ListItemUser'
import Car from "../components/Car";
import {useNavigation} from '@react-navigation/native';


function SearchPage() {
    const [searchUser, setSearchUser] = useState(false)
    const [text, setText] = useState('')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    useEffect(() => {
        const loadCarData = async () => {
            setLoading(true)
            const data = await getSearchData(text)
            setData(data)
            setLoading(false)
        }
        const loadUserData = async () => {
            setLoading(true)
            const data = await getSearchUserData(text)
            setData(data)
            setLoading(false)
        }
        if (searchUser) {
            loadUserData();
        } else {
            loadCarData();
        }
    }, [text])

    return (
        <ScrollView style={{
            backgroundColor: color.background
        }}>
            <View style={{
                flex: 1,
                marginTop: 30,
                alignItems: "center"
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                    }}
                >
                    <Text style={{color: color.text, marginRight: 40, fontSize: 20}}>Search a car</Text>
                    <Switch
                        trackColor={{false: "#767577", true: "#81b0ff"}}
                        thumbColor={searchUser ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={value => {
                            setSearchUser(value);
                            setText('');
                            setLoading(true);
                        }}
                        value={searchUser}
                    />
                    <Text style={{color: color.text, marginLeft: 40, fontSize: 20}}>Search a user</Text>
                </View>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: color.border,
                        backgroundColor: color.background,
                        width: 300,
                        height: 50,
                        paddingLeft: 5,
                        marginBottom: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: color.text,
                        marginTop: 50
                    }}
                    placeholderTextColor={color.text}
                    placeholder="Enter a car model or username"
                    onChangeText={
                        (value) => setText(value)
                    }
                />
                {
                    text === '' ? <Text style={{color: color.text}}>Enter text to see data</Text> : (
                        <View>
                            {searchUser ?
                                data.map((user) =>
                                    <ListItemUser
                                        key={user.id}
                                        user={user}
                                        loading={loading}
                                        onClick={() => console.log('soon')}
                                    />)
                                : (
                                    loading ? <Text>Loading...</Text> : (
                                        data.map((car) =>
                                            <Car
                                                key={car.id}
                                                car={car}
                                                onClick={() => navigation.navigate("Info", {data: car})}
                                            />)))
                            }
                        </View>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default SearchPage

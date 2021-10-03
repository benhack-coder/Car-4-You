import React, {Component} from 'react';
import {View, Text, ScrollView, TextInput, Alert, AsyncStorage} from 'react-native';
import {Button} from "react-native-elements";
import NoFilterNavbar from "../components/NoFilterNavbar";
import color from '../colors.json';
import {login} from '../api';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    async makeRequest() {
        const response = await login(this.state.username, this.state.password)
        this.checkResponse(response)
    }

    async storeUserName() {
        try {
            await AsyncStorage.setItem(
                'username',
                this.state.username
            );
        } catch (error) {
            alert("Could not save username")
        }
    };

    async storePassword() {
        try {
            await AsyncStorage.setItem(
                'password',
                this.state.password
            );
        } catch (error) {
            alert("Could not save password")
        }
    };

    checkResponse(response) {
        this.storeUserName();
        this.storePassword()
        if (response === 1) {
            this.props.navigation.navigate('LoggedIn');
            this.setState({username: '', password: ''})
            Alert.alert("Login Successful")
        } else if (response === 2) {
            Alert.alert("Login Failed", "Try Again")
        } else {
            Alert.alert("Something went Wrong!", "Try Again")
        }
    }

    render() {
        return (
            <ScrollView
                style={{
                    backgroundColor: color.background
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <NoFilterNavbar/>
                    <TextInput
                        style={{
                            color: color.text,
                            height: 40,
                            width: 250,
                            borderColor: color.border,
                            borderWidth: 1,
                            marginTop: 100,
                            padding: 5
                        }}
                        placeholderTextColor={color.text}
                        placeholder="Username"
                        onChangeText={username => {
                            this.setState({username: username})
                        }}
                        value={this.state.username}
                    />
                    <TextInput
                        secureTextEntry={true}
                        style={{
                            color: color.text,
                            height: 40,
                            width: 250,
                            borderColor: color.border,
                            borderWidth: 2,
                            marginBottom: 150,
                            padding: 5

                        }}
                        placeholderTextColor={color.text}
                        placeholder="Password"
                        onChangeText={password => {
                            this.setState({password: password});
                        }}
                        value={this.state.password}
                    />
                    <Button
                        buttonStyle={{
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
                            this.makeRequest();
                        }}
                        title="Sign In"
                        titleStyle={{
                            marginHorizontal: 5,
                            color: color.text
                        }}

                        type="outline"
                    />
                    <Text
                        style={{
                            marginTop: 10,
                            color: color.text
                        }}
                    >
                        No account yet?
                    </Text>

                    <Text
                        style={{
                            color: "white"
                        }}
                        onPress={() => this.props.navigation.navigate("Sign Up")}
                    >
                        Create one !
                    </Text>
                </View>
            </ScrollView>
        )
    }
}

export default SignIn

import React, {Component} from 'react';
import {View, ScrollView, TextInput, Alert, Text, AsyncStorage} from 'react-native';
import {Button} from "react-native-elements";
import NoFilterNavbar from "../components/NoFilterNavbar";
import color from "../colors.json"
import * as Animatable from 'react-native-animatable';
import {register} from '../api';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            repeatedPassword: '',
            validUser: true,
            validEmail: true,
            validPassword: true,
            validCPassword: true
        }
    }

    handleValidUser(value) {
        if (value.trim().length >= 4) {
            this.setState({validUser: true});
        } else {
            this.setState({validUser: false});
        }
    }

    handleValidMail(value) {
        let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(value)) {
            this.setState({validEmail: true});
        } else {
            this.setState({validEmail: false});
        }
    }


    handleValidPassword(value) {
        if (value.trim().length >= 8) {
            this.setState({validPassword: true});
        } else {
            this.setState({validPassword: false});
        }
    }

    handleValidCPassword(value) {
        if (value === this.state.password) {
            this.setState({validCPassword: true});
        } else {
            this.setState({validCPassword: false});
        }
    }

    invalidInputsAlert() {
        Alert.alert(
            'Please check your Inputs',
            'Try Again',
            [
                {text: 'OK'},
            ]
        );
    }

    checkInputs() {
        if ((this.state.validUser === true) && (this.state.validPassword === true) && (this.state.validEmail === true) && (this.state.validCPassword === true)) {
            return true
        } else {
            return this.invalidInputsAlert()
        }
    }

    checkInputsFilled() {
        if (!(this.state.password === '') && !(this.state.repeatedPassword === '') && !(this.state.email === '') && !(this.state.username === '')) {
            return true
        } else {
            return alert("Please fill something in")
        }
    }


    successfulAlert() {
        Alert.alert(
            'Successfully signed up',
            'You are logged in',
            [
                {text: 'OK'},
            ]
        );
    }

    async makeRequest() {
        const response = await register(this.state.username, this.state.email, this.state.password)
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
        if (response === 1) {
            this.storeUserName()
            this.storePassword()
            this.props.navigation.navigate('LoggedIn');
            this.setState({username: '', email: '', password: '', repeatedPassword: ''})
            this.successfulAlert()
        } else if (response === 0) {
            alert("User already exists")
        } else {
            alert("Something went wrong")
        }
    }

    render() {
        return (
            <ScrollView
                style={{
                    backgroundColor: color.background
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>

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
                            this.setState({username: username});
                        }}
                        value={this.state.username}
                        onEndEditing={(e) => this.handleValidUser(e.nativeEvent.text)}
                    />
                    {this.state.validUser ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{color: "red"}}>Username must be 4 characters long</Text>
                        </Animatable.View>
                    }

                    <TextInput
                        style={{
                            color: color.text,
                            height: 40,
                            width: 250,
                            borderColor: color.border,
                            borderWidth: 1,
                            padding: 5
                        }}
                        placeholderTextColor={color.text}
                        placeholder="Email"
                        onChangeText={email => {
                            this.setState({email: email});
                        }}
                        value={this.state.email}
                        onEndEditing={(e) => this.handleValidMail(e.nativeEvent.text)}
                    />
                    {this.state.validEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{color: "red"}}>Email is not valid</Text>
                        </Animatable.View>
                    }

                    <TextInput
                        secureTextEntry={true}
                        style={{
                            color: color.text,
                            height: 40,
                            width: 250,
                            borderColor: color.border,
                            borderWidth: 1,
                            padding: 5,
                            marginTop: 50,
                        }}
                        placeholderTextColor={color.text}
                        placeholder="Password"
                        onChangeText={password => {
                            this.setState({password: password});
                        }}
                        value={this.state.password}
                        onEndEditing={(e) => this.handleValidPassword(e.nativeEvent.text)}
                    />
                    {this.state.validPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{color: "red"}}>Password must be 8 characters long</Text>
                        </Animatable.View>
                    }

                    <TextInput
                        secureTextEntry={true}
                        style={{
                            color: color.text,
                            height: 40,
                            width: 250,
                            borderColor: color.border,
                            borderWidth: 1,
                            padding: 5,
                        }}
                        placeholderTextColor={color.text}
                        placeholder="Confirm Password"
                        onChangeText={repeatedPassword => {
                            this.setState({repeatedPassword: repeatedPassword});
                        }}
                        value={this.state.repeatedPassword}
                        onEndEditing={(e) => this.handleValidCPassword(e.nativeEvent.text)}
                    />
                    {this.state.validCPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{color: "red"}}>Password doesn't match</Text>
                        </Animatable.View>
                    }
                    <Button
                        buttonStyle={{
                            width: 150,
                            borderColor: color.border,
                            borderRadius: 100,
                            backgroundColor: color.buttonBackground,
                            marginTop: 50,
                        }}
                        containerStyle={{margin: 5}}
                        loadingProps={{animating: true}}
                        onPress={() => {
                            if (this.checkInputsFilled() && this.checkInputs()) {
                                this.makeRequest()
                            }
                        }}
                        title="Sign Up"
                        titleStyle={{
                            marginHorizontal: 5,
                            color: color.text
                        }}
                        type="outline"
                    />
                </View>
            </ScrollView>
        );
    }
}

export default SignUp

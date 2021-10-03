import React, {useState} from 'react'
import {View, Text, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import color from '../colors.json';
import {Button} from 'react-native-elements';
import CalendarPicker from 'react-native-calendar-picker';
import {ScrollView} from 'react-native-gesture-handler';

function DatePickerPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    let dailyPrice = 0;
    const navigation = useNavigation();
    const route = useRoute();
    const minDate = new Date();
    const index = startDate.toString().indexOf("12:00:00")
    let startStr = startDate ? startDate.toString().substr(0, index) : "Select a rental date";
    let endStr = endDate ? endDate.toString().substr(0, index) : "Select an end date";

    const setRange = (date, type) => {
        if (type === 'END_DATE') {
            setEndDate(date);
        } else {
            setStartDate(date);
        }
    }

    if (endDate != null && endDate !== '') {
        const oneDay = 1000 * 3600 * 24;
        let days = (endDate - startDate) / oneDay + 1;
        dailyPrice = days * route.params.car.dailyPrice;
    }
    const doNavigation = () => {
        if (startDate != null && startDate !== '' && endDate != null && endDate !== '') {
            navigation.navigate("Owner", {
                ownerName: route.params.ownerName,
                car: route.params.car,
                startDate: startDate.toString(),
                endDate: endDate.toString(),
                rentalPrice: dailyPrice
            })
        } else {
            Alert.alert("You need to select a rental date")
        }
    }

    return (
        <ScrollView style={{backgroundColor: color.background}}>
            <View style={{paddingTop: "20%", justifyContent: "center", alignItems: "center"}}>
                {
                    startDate && endDate != null ? <Text
                            style={{color: color.text, fontSize: 23, paddingBottom: "20%"}}>{startStr} - {endStr}</Text> :
                        <Text style={{color: color.text, fontSize: 30, paddingBottom: "20%"}}>Select a rental
                            date</Text>
                }
                <CalendarPicker
                    selectedDayColor={color.buttonBackground}
                    textStyle={{color: color.text}}
                    allowRangeSelection="true"
                    onDateChange={(date, type) => setRange(date, type)}
                    selectedRangeStartStyle={{backgroundColor: "green"}}
                    selectedRangeEndStyle={{backgroundColor: "green"}}
                    minDate={minDate}
                />
                <Button style={{paddingTop: "20%"}} onPress={() => doNavigation()} title="Continue"/>
                <Text style={{color: color.text, fontSize: 30, paddingBottom: "20%", paddingTop: "10%"}}>Price for
                    rental: {dailyPrice}$</Text>
            </View>
        </ScrollView>
    )
}

export default DatePickerPage

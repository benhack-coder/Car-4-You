import React, {useState, useEffect, useRef} from 'react'
import {ScrollView, Animated} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native';
import Car from "../components/Car";
import SpinnerComponent from "../components/SpinnerComponent";
import NoCarsFound from "../components/NoCarsFound.";
import color from "../colors.json"
import {getSearchData} from '../api';


function ModelsPage() {

    const navigation = useNavigation();
    const route = useRoute();
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadModels = async () => {
            const data = await getSearchData(route.params.modelName)
            setModels(data)
            setLoading(false)
        }
        loadModels();
    }, [])

    const slide = useRef(new Animated.Value(-500)).current;

    useEffect(() => {
        Animated.timing(
            slide,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }, [slide]);

    return loading ? <SpinnerComponent isLoading={loading}/> : (
        <ScrollView style={{
            backgroundColor: color.background
        }}>
            <Animated.View
                style={{
                    transform: [{
                        translateX: slide
                    }
                    ]
                }}
            >
                {models.length === 0 ? <NoCarsFound/> : (
                    models.map((car) =>
                        <Car key={car.id}
                             car={car}
                             onClick={() => navigation.navigate("Info", {itemId: car.id, data: car})}/>
                    ))}
            </Animated.View>
        </ScrollView>
    )
}

export default ModelsPage

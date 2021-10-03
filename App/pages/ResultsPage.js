import React, {useState, useEffect} from "react";
import {View, ScrollView} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import color from "../colors.json"
import SpinnerComponent from '../components/SpinnerComponent'
import Car from "../components/Car"
import NoCarsFound from "../components/NoCarsFound."
import {getFilteredModels} from "../api";

function ResultsPage() {
    const route = useRoute();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    useEffect(() => {
        const loadModels = async () => {
            const data = await getFilteredModels(route.params.price, route.params.km, route.params.location)
            setData(data)
            setLoading(false)
        }
        loadModels();
    }, [])

    return loading ? <SpinnerComponent isLoading={loading}/> : (
        <ScrollView
            style={{
                backgroundColor: color.background,
            }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 30,
                    alignItems: "center",
                }}
            >
                {data.length === 0 ? <NoCarsFound/> : (
                    data.map((car) =>
                        <Car key={car.id}
                             car={car}
                             onClick={() => navigation.navigate("Info", {itemId: car.id, data: car})}/>
                    ))}
            </View>
        </ScrollView>
    );
}

export default ResultsPage;

import React, {useState, useEffect, useRef} from "react";
import {Animated, ScrollView} from "react-native";
import color from "../colors.json"
import {useNavigation, useRoute} from '@react-navigation/native';
import {Tile} from "react-native-elements";
import SpinnerComponent from '../components/SpinnerComponent'
import {getModelsByBrand} from "../api";

function FilterPage() {

    const navigation = useNavigation();
    const route = useRoute();
    const [models, setModels] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModels = async () => {
            const data = await getModelsByBrand(route.params.brand)
            setModels(data)
            setLoading(false)
        }
        loadModels();
    }, [])

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim]);

    return loading ? <SpinnerComponent isLoading={loading}/> : (
        <ScrollView
            style={{
                backgroundColor: color.background
            }}
        >
            <Animated.View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyItems: "center",
                    opacity: fadeAnim
                }}
            >
                {
                    models.Results.map((model) =>
                        <Tile key={model.Model_ID}
                              featured
                              title={model.Model_Name}
                              titleStyle={{
                                  color: color.text,
                                  fontSize: 50
                              }}
                              onPress={() => navigation.navigate("Models", {modelName: model.Model_Name})}/>
                    )}
            </Animated.View>
        </ScrollView>
    )
}

export default FilterPage;

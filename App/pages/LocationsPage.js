import React from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import NoFilterNavbar from "../components/NoFilterNavbar";

function LocationsPage() {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },

        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },

    });

    return (
        <ScrollView>
            <NoFilterNavbar/>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                >
                    <Marker coordinate={{latitude: 47.3686498, longitude: 8.5391825}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Zurich</Text>
                            </View>
                        </Callout>
                    </Marker>
                    <Marker coordinate={{latitude: 47.19133020, longitude: 8.85600370}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Lachen</Text>
                            </View>
                        </Callout>
                    </Marker>
                    <Marker coordinate={{latitude: 47.2570817, longitude: 8.800881}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Wolfhausen</Text>
                            </View>
                        </Callout>
                    </Marker>
                    <Marker coordinate={{latitude: 47.2523354, longitude: 8.7680277}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Hombrechtikon</Text>
                            </View>
                        </Callout>
                    </Marker>
                    <Marker coordinate={{latitude: 47.5606, longitude: 7.5906}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Basel</Text>
                            </View>
                        </Callout>
                    </Marker>
                    <Marker coordinate={{latitude: 46.0103, longitude: 8.9625}} pinColor="black">
                        <Callout>
                            <View>
                                <Text>Lugano</Text>
                            </View>
                        </Callout>
                    </Marker>
                </MapView>
            </View>
        </ScrollView>
    );
}

export default LocationsPage



import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';

//Importações do mapa
import MapView, { Marker, Callout } from 'react-native-maps';

//requestPermissionsAsyn Para pedir permissão de geolocation do usuario
//getCurrentPositionAsync Para pegar as infos de geolocatio do usuario
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api';
import { connect, disconnect, subscribeToNewDev } from '../services/socket';

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentReagion, setCurrentReagion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {//Pegando as coordenadas do usuário
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentReagion({//Define o zoom inicial no mapa
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }

        loadInitialPosition();
    }, []);
    useEffect(()=>{
        subscribeToNewDev(dev => setDevs([...devs, dev]));
    },[devs]);

    function setupWebsocket() {
        disconnect();

        const { latitude, longitude } = currentReagion;

        connect(latitude, longitude, techs);
    }

    async function loadDevs() {
        const { latitude, longitude } = currentReagion;

        const response = await api.get('/seach', {
            params: {
                latitude,
                longitude,
                techs
            }
        });
        setDevs(response.data.devs);
        setupWebsocket();
    };

    //Alterando latitude e longitude quando o usuario arrasta a tela no mapa 
    function handleRegionChanged(region) {
        setCurrentReagion(region);
    }

    if (!currentReagion) {
        return null;
    };

    return (//Isto é o mapa sendo mostrado
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentReagion} style={styles.map}>
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{
                        latitude: dev.location.coordinates[1],
                        longitude: dev.location.coordinates[0]
                    }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username });
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text styles={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={styles.seachForm}>
                <TextInput
                    style={styles.seachInput}
                    placeholder="Buscar devs por tecnologia..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </>
    );
}


//Toda a parte de estilização fica daqui para baixo
const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    avatar: {
        width: 54,
        height: 54,
        alignContent: 'center',
        borderRadius: 6,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 4,
    },
    devTechs: {
        marginTop: 5,
    },
    seachForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    seachInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 6,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
})

export default Main;

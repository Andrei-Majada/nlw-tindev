import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

import Logo from '../assets/logo.png';
import Axios from 'axios';
//KeyboardAvoidingView = somente para o IOS, nao passar a caixa do teclado sobre o input da tela.

export default function Login({navigation}) {
    const[user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', {user});
            }
        })    
    } [])
    
    async function handleLogin() {
        const response = await api.post('/devs', {username: user});

        const { _id } = reponse.data;

        await AsyncStorage.setItem('user', _id);
        
        navigation.navigate('Main', {user: _id});
    }
    
    return(
        <KeyboardAvoidingView 
        behavior={padding}
        enabled={Platform.OS ==='ios'}
        style={Styles.container}>
            <Image source={Logo}/>
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite seu usuário no Github"
                placeholderTextColor="#999"
                style={Styles.input}
                value={user}
                onChangeText={setUser}
            ></TextInput>
            <TouchableOpacity onPress={handleLogin} style={Styles.button} ><Text style={Styles.buttonText}>Entrar</Text></TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: #f5f5f5,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    input: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: #ddd,
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    button: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: "#df4723",
        borderRadius: 4,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});
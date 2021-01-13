import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
import Io from 'socket.io-client';

import Logo from '../assets/logo.png';
import Like from '../assets/like.png';
import Dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({navigation}) {
  const id = navigation.getParam('user');
  const [user, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });
      setUsers(response.data);
    }
    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = Io('http://localhost:3333', {
      query: {user: id},
    });

    socket.on('match', (dev) => {
      setMatchDev(dev);
    });
  }, [id]);

  async function handleLike(id) {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {user: id},
    });

    setUsers(rest);
  }

  async function handleDislike(id) {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {user: id},
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }
  return (
    <SafeAreaView style={Styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={Styles.logo} source={Logo}></Image>
      </TouchableOpacity>
      <View style={Styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={Styles.empty}>Acabou :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={use._id}
              style={(Styles.card, {zIndex: user.length - index})}>
              <Image style={Styles.avatar} source={{uri: user.avatar}} />
              <View style={Styles.footer}>
                <Text style={Styles.name}>{user.name}</Text>
                <Text style={Styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {users.length > 0 && (
        <View style={Styles.buttonsContainer}>
          <TouchableOpacity style={Styles.button} onPress={handleDislike}>
            <Image source={Dislike} />
          </TouchableOpacity>

          <TouchableOpacity style={Styles.button} onPress={handleLike}>
            <Image source={Like} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={Styles.matchContainer}>
          <Image style={Styles.matchImage} source={itsamatch}></Image>
          <Image
            style={Styles.matchAvatar}
            source={{uri: matchDev.avatar}}></Image>
          <Text Style={(Styles, matchName)}>{matchDev.name}</Text>
          <Text Style={(Styles, matchbio)}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text stule={Styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: #f5f5f5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  logo: {
    marginTop: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: rgba(0, 0, 0, 0.8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  },
  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  matchbio: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: rgba(255, 255, 255, 0.8),
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  closeMatch: {
    fontSize: 16,
    color: rgba(255, 255, 255, 0.8),
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});

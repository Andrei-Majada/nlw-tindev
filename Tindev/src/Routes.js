import { createAppContainer, CreateSwitchNavigator } from 'react-navigation'; //createStackNavigator, createBottomTabNavigator, createDrawerNavigator
import Login  from './pages/Login';
import Main from './pages/Main';

export default function createAppContainer(
    CreateSwitchNavigator({
        //as paginas aparecem na ordem descrita aqui!
        Login,
        Main,
    })
);
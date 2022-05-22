import { createAppContainer, HeaderBackButton } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import { TouchableOpacity, Text } from 'react-native'
import LoginScreen from './src/screens/login.component';
var React = require('react-native');
import MainNavigation from './src/navigation/navigation.component';
const AppNavigatorForm = createStackNavigator({
    Login: { screen: LoginScreen },
    MainNavigation: { screen: MainNavigation },
}, {
        initialRouteName: 'Login',
        headerMode: 'none'
    });
const AppNavigator = createAppContainer(AppNavigatorForm);
export default AppNavigator;

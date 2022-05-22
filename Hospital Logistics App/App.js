import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Button ,IconRegistry } from '@ui-kitten/components';
import { default as theme } from './custom-theme.json'; 
import { LoginScreen } from './src/screens/login.component';
import { ThemeContext } from './theme-context';
import  AppNavigator from './AppNavigator';
import { Alert } from 'react-native';
navigator.geolocation = require('@react-native-community/geolocation');
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true;
export default () => {

  const [theme] = React.useState('light');

  const [loading, setLoading] = React.useState(true);


  useEffect(() => {
    requestUserPermission();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });


    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });
   }, []);

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

 

  if (loading) {
    return null;
  }


  return (
    <ThemeContext.Provider value={{ theme }}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
      <AppNavigator/>
  </ApplicationProvider>
  </ThemeContext.Provider>
);
};
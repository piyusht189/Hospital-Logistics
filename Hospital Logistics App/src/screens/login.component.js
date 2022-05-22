import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback, View , Image, PermissionsAndroid, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Divider, Icon,Input, Layout, Button, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import { HomeScreen } from './dashboard.component';
import messaging from '@react-native-firebase/messaging';
import { NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
class LoginScreen extends Component {
  
  state = {
    email : '',
    password: '',
    spinner : true,
    secureTextEntry: true,
    enableLogin: false
  }
  
  toggleSecureEntry = () => {
    this.setState({secureTextEntry : !this.state.secureTextEntry});
  };

  renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
      <Icon {...props} name={this.state.secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );
  _retrieveData = async () => {
    try {
      let value = await AsyncStorage.getItem('loggedin');
      if (value) {
        if(value == 'yes'){
          var cred = await AsyncStorage.getItem('cred');
          if (cred) {
            cred = JSON.parse(cred);
            if(cred.email && cred.password){
              this.setState({email: cred.email, password: cred.password});
              this.requestLocationPermission2(cred);
             // this.login(cred.email, cred.password);
            }else{
              this.setState({spinner: false});
            }
          }else{
            this.setState({spinner: false});
          }
        }else{
          this.setState({spinner: false});
        }
      }else{
        this.setState({spinner: false});
      }
      
    } catch (error) {
      this.setState({spinner: false});
        Toast.show(e.message, Toast.LONG);
    }
  };
  componentDidMount = () => {
      SplashScreen.hide();
      this.requestLocationPermission2();
      this._retrieveData();
 
  }
  
  _storeData = async (user,em,pass) => {
    try {
      await AsyncStorage.setItem('loggedin',"yes");
      await AsyncStorage.setItem('user',JSON.stringify(user));
      await AsyncStorage.setItem('cred',JSON.stringify({email: em, password: pass}));
      messaging()
      .subscribeToTopic(user['aadid'] ? 'a' + user['aadid'] : 'r'+user['radid'])
      .then(() => {
        console.log("Subscribed to " + user['aadid'] ? 'a' + user['aadid'] : 'r' + user['radid']);
        
        this.props.navigation.replace('MainNavigation');
        this.setState({spinner: false});
      });
     
    } catch (e) {
        Toast.show(e.message, Toast.LONG);
    }
  }

  

  login = (email_p ,password_p) => {
    if(this.state.enableLogin){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
          .then(data => { 
            if((this.state.email && this.state.password) || (email_p && password_p)){
              this.setState({spinner: true});
              fetch('https://drivecraftlab.com/backend_gis/api/driver/driver_login.php?token=login', {
                  method: 'POST',
                  body: JSON.stringify({
                    email: this.state.email ? this.state.email : email_p,
                    password: this.state.password ? this.state.password : password_p
                  })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if(responseJson.status_code == 200){
                  this._storeData(responseJson.user, this.state.email ? this.state.email : email_p, this.state.password ? this.state.password : password_p);
              }else{
                  this.setState({spinner: false});
                  Toast.show(responseJson.message, Toast.LONG);
              }
            })
            .catch((error) => {
               console.error(error);
            });
          }else{
              Toast.show('Enter email and password.', Toast.LONG);
          }
          }).catch(err => {
            Alert.alert("Please enable location of your mobile!");
          });
   
   }else{
     Alert.alert(
      "Location Not Allowed",
      "Please Allow Location Permission",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Request", onPress: () => this.requestLocationPermission2() }
      ],
      { cancelable: false }
    );
   }
  }
   async requestLocationPermission2(flag) 
   {
    try {
      let granted =  await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Access',
          'message': 'Allow access to location'
        } );

        if (granted) {
          this.setState({enableLogin: true});
          setTimeout(() => {
            
            if(flag){
              this.login(flag.email, flag.password);
            }
            
          },500)   
        } 
        else {
          let granted1 = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Location Access',
              'message': 'Allow access to location'
            } );
    
            if (granted1 === PermissionsAndroid.RESULTS.GRANTED) {
              this.setState({enableLogin: true});
              setTimeout(() => {
                if(flag){
                  this.login(flag.email, flag.password);
                }
                
              },500)   
            } 
            else {
              Alert.alert("Please permit location access from settings!");
          //  this.logoutRequest();
            }
      //  this.logoutRequest();
        }
     
    } catch (err) {
      console.warn(err)
    }
  }
  /*let granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              'title': 'Location Access',
              'message': 'Allow access to background location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           
          } else {
            Alert.alert("here2");
            // Logout
           //  this.logoutRequest();
          }*/
  render() {
    return (
    <SafeAreaView style={{ flex: 1 }}>
       
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30, marginBottom: 30 }}>Hospital Logistics</Text>
      <Spinner
          visible={this.state.spinner}
          overlayColor={'#aaaaaaff'}
          textContent={'Hold on...'}
          textStyle={styles.spinnerTextStyle}
        />
      <Input
      style={styles.input}
      placeholder='Email'
      value={this.state.email}
      onChangeText={email => this.setState({email: email})}
    />
    <Input
      value={this.state.password}
      style={styles.input}
      placeholder='Password'
      secureTextEntry={this.state.secureTextEntry}
      onChangeText={password => this.setState({password: password})}
    />
     <Button style={styles.button} appearance='outline' status='primary' size='medium' onPress={() => this.login()}>Login
     </Button>
    
      
      </Layout>
    </SafeAreaView>
  );
  }
};


export default LoginScreen;


const styles = StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    button: {
        marginTop: 20
    },
    input: {
      marginLeft: 30,
      marginRight: 30,
      marginTop: 20
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    spinnerTextStyle: {
        color: '#FFF'
      }
  });

  
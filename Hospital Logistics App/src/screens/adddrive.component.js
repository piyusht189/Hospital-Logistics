import React, { Component } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View,Alert, TouchableOpacity, Image, TextInput, ScrollView, LocationItem } from 'react-native';
import { Button, Divider, Layout, TopNavigation, TopNavigationAction, Toggle, Card, List, Modal,  Input} from '@ui-kitten/components';
import moment from "moment";
import 'moment-timezone';
import 'moment/min/moment-with-locales'
import CustomMarker from "./customMarker";
import AsyncStorage from '@react-native-community/async-storage'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { mapStyle } from './mapStyle'
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { NavigationActions } from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import { StackActions } from 'react-navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 20.358435;
const LONGITUDE = 85.821394;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class AddDriveScreen extends Component {
  did_holder
  token
  value
  index_holder
  region_holder = {latitude:0, longitude: 0}
  state = {
    work_log: [{location: 'Select Location', message: '', phone: ''}],
    loading: false,
    polyline: { show: false, coordinates: [] },
    trackChanges: false,
    visible: false,
    drivePoints: {}
  } 
  static navigationOptions = ({ navigation }) =>  {
    return {
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={navigation.getParam('_addDrive')}>
          <Text style={{ marginRight: 10, color: '#fff' }}>Add Drive</Text>
      </TouchableOpacity>
    </View>
    )
   }
  };
  async componentDidMount(){
    this.props.navigation.setParams({ _addDrive: this.addDrive });
    value = await AsyncStorage.getItem('user');
    value = JSON.parse(value);
    this.token = value.token;
    this.did_holder = value.aadid;
  }
  addDrive = () => {
    if(this.state.work_log[0]['message'] && this.state.work_log[0]['location'] != 'Select Location' && this.state.work_log.length > 1){
      if(this.state.work_log[1]['message'] && this.state.work_log[1]['location'] != 'Select Location'){
        let temp  = JSON.parse(JSON.stringify(this.state.work_log));
        temp = temp.filter(e => {
          return e.location && e.message;
        })
        temp = temp.map(e => {
          let arr_temp = e.location ? e.location.split(',') : [];
          e['lat'] = arr_temp[0];
          e['lng'] = arr_temp[1];
          delete e['location'];
          return e;
        })
        let req_obj = {did: this.did_holder, worklog: JSON.stringify(temp), mobile: true};
        
        this.setState({loading: true});
        fetch('https://drivecraftlab.com/backend_gis/api/task/add_task.php?token=' + this.token, {
            method: 'POST',
            body: JSON.stringify(req_obj)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          
          if(responseJson.status_code == 200){
           
            this.setState({loading: false});

            Toast.show(responseJson.message, Toast.LONG);

            this.setState({work_log: [{location: 'Select Location', message: '', phone: ''}]});

            const navigateAction = NavigationActions.navigate({
              routeName: 'Dashboard'
            });
            this.props.navigation.dispatch(navigateAction);

            
          }else if(responseJson.status_code == 800){
            this.logoutRequest();
          }else{
            Toast.show(responseJson.message, Toast.LONG);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      }else{
        Toast.show('Minimum 2 Points should be filled', Toast.LONG);
      }
    }else{
      Toast.show('Minimum 2 Points should be filled', Toast.LONG);
    }
  }
  logoutRequest() {
    setTimeout(async () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login', params: { logout: true } })]
        });
        let user = await AsyncStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                messaging()
                .unsubscribeFromTopic(user['aadid'] ? 'a' + user['aadid'] : 'r' + user['radid'])
                .then(() => {
                    console.log("Unsubscribed from " + user['aadid'] ? 'a' + user['aadid'] : 'r' + user['radid'])
                    AsyncStorage.setItem('loggedin', '');
                    AsyncStorage.setItem('user', '');
                    AsyncStorage.setItem('cred', '');
                    this.props.navigation.dispatch(resetAction);
                });
            }
    }, 100)
}
onChangeMessage = (text, index) => {
  this.setState(prevState => {
    prevState.work_log[index]['message'] = text
    return {
      work_log: prevState.work_log
    }
  }, () => {})
}
onChangePhone = (text, index) => {
  this.setState(prevState => {
    prevState.work_log[index]['phone'] = text
    return {
      work_log: prevState.work_log
    }
  }, () => {})
}
openMap(index){
    this.index_holder = index;
    this.setState({visible : true})
}
setLocation(){
  this.setState(prevState => {
    prevState.work_log[this.index_holder]['location'] = this.region_holder['latitude'] + ',' + this.region_holder['longitude']
    return {
      work_log: prevState.work_log
    }
  }, () => {});
  this.setState({visible: false})
}
crud(flag){
  let arr  = JSON.parse(JSON.stringify(this.state.work_log));
  if(flag == 'add'){
    //Add
    arr.push({location: 'Select Location', message: '', phone: ''});
  }else{
    //Remove
    arr.pop();
  }
  this.setState({work_log: arr});
}
  render() {
    return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
      <Spinner
          visible={this.state.loading}
          overlayColor={'#aaaaaaff'}
          textContent={'Hold on...'}
          textStyle={styles.spinnerTextStyle}
        />
        {this.state.work_log.map((e,i) => (
        <View style={{ margin: 10, borderColor: '272c36', borderWidth: 1, borderRadius: 15 }}>
          <Text style={{ marginHorizontal: 0, textAlign: 'center', backgroundColor: '#272c36', color: '#fff', borderTopRightRadius: 15,borderTopLeftRadius: 14, paddingVertical: 5}}>Point {i+1}</Text>
          <View style={{paddingHorizontal: 15}}>
          <View style={{marginBottom: 10,marginTop: 10, flexDirection: 'row'}}>
                <View style={{ flex: 0.1 }}>
                  <Text style={{ marginTop: 10,fontSize:14 }}>At</Text></View>
                <View style={{ flex: 0.9 }}>
                <View 
                      style={{borderRadius: 5, borderColor: '#3366ff', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f3f6f9'}}
                      onStartShouldSetResponder={() => {this.openMap(i)}}
                    > 
                      {e.location != 'Select Location' && 
                      <Text style={{ fontSize: 12 }}>{e.location}</Text>
                      }
                      {e.location == 'Select Location' && 
                      <Text style={{color: '#8f99af', fontSize: 12, fontWeight: '500'}}>{'Select Location'}</Text>
                      }
                      
                      
                    </View>
                </View>
          </View>
          <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View style={{ flex: 0.1 }}>
                        <Text style={{ marginTop: 10,fontSize:14 }}>Do</Text></View>
                  <View style={{ flex: 0.9 }}>
                  <Input textStyle={{ fontSize: 12 }} status='primary'
                        placeholder='Enter Message'
                        value={e.message}
                        onChangeText={text => this.onChangeMessage(text, i)} 
                      />
                  </View>
          </View>
          <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View style={{ flex: 0.1 }}>
                        <Text style={{ marginTop: 10,fontSize:14 }}>Call</Text></View>
                  <View style={{ flex: 0.9 }}>
                  <Input textStyle={{ fontSize: 12 }} status='primary'
                        placeholder='Enter Phone'
                        value={e.phone}
                        onChangeText={text => this.onChangePhone(text, i)} 
                      />
                  </View>
          </View>
          </View>
          </View>
         ))
        }
        <View style={styles.footerContainer}>
                  <Button style={styles.button} appearance='outline' size='small' status='success' onPress={() => this.crud('add')}>
                      + Add Point
                  </Button>
                  {this.state.work_log.length > 1 &&
                  <Button style={styles.button} appearance='outline' size='small' status='danger' onPress={() => this.crud('remove')}>
                      - Remove Point
                  </Button>
                  }
        </View>
        <Modal
        style={{flex:1, height: ScreenHeight-100, width: ScreenWidth-30 }}
        visible={this.state.visible}
        backdropStyle={styles.backdrop}
        >
        <View disabled={true} style={{flex:1, position:'relative'}}>
        <GooglePlacesAutocomplete style={{ position: 'relative', top: 0, right: 0 , zIndex: 9999}}
                placeholder='Search'
                fetchDetails = {true}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  if(details){
                    if(details['geometry']){
                      if(details['geometry']['location']){
                        this.map.animateToRegion({
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                          latitudeDelta: LATITUDE_DELTA,
                          longitudeDelta: LONGITUDE_DELTA
                      }, 2000);
                      }
                    }
                  }
                }}
                autoFillOnNotFound = {false}
                enablePoweredByContainer = {false}
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
             
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 0
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 44,
                    color: '#5d5d5d',
                    fontSize: 16,
                    marginTop: -2,
                  },
                  container: {
                    zIndex: 9999,
                    borderWidth: 2,
                    borderColor: '#3366ff',
                    borderRadius: 5,
                    backgroundColor: '#ffffff00'
                  },
                  row: {
                    backgroundColor: '#fff',
                    fontSize: 12
                  }
                }}                
                query={{
                  key: 'AIzaSyDSajiOQJxvgkAWjhA6ZOjUHi83ju_ACwE',
                  language: 'en'
                }}
              />
        
        <View style={[styles.mapContainer, { zIndex: 1, backgroundColor: '#000', flexDirection: 'column' }]}>
                    <MapView  onRegionChange={(reg => {this.region_holder = reg})} showsMyLocationButton={true} showsUserLocation={true}  customMapStyle={mapStyle} showsTraffic={true} ref="map" style={[styles.map]} rotateEnabled={false} ref={(el) => this.map = el}>
                                              
                    </MapView>
                    <Image style={{ width: 40, height:40,flexGrow:1,alignItems: 'center',justifyContent:'center', }} resizeMode='contain' source={require('../assets/images/pointer.png')} />
                 
                            </View>
            <View style={{ position: 'absolute', bottom:1, right: 0, left: 0, flexDirection: 'row'}}>
          <Button style={{ position: 'relative', flex:0.5, marginRight:1}} onPress={() => this.setLocation()}>
            Set Location
          </Button>
          <Button style={{ position: 'relative', flex:0.5, backgroundColor: '#fff'}} onPress={() => this.setState({visible: false})}>
            <Text style={{color: '#000'}}>Close</Text>
          </Button>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
  }
};

export default AddDriveScreen;


const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  layoutDiv : {
    height: ScreenHeight
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: ScreenWidth - 50,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center'
  },
  button: {
    marginTop: 8,
    padding: 0,
    marginHorizontal: 2,
    flex: 1
  },
  item: {
    marginVertical: 4,
  },
  contentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    width: ScreenWidth
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mapContainer: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'center',
    top: 45,
    left: 0,
    right: 0,
    bottom: 50
},
map: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
},
content: {
  flex: 1,                            // Take up all available space
  backgroundColor: '#aaa',
  justifyContent: 'center',           // Center vertically
  alignItems: 'center',               // Center horizontally
  backgroundColor: '#C2185B',         // Darker background for content area
},

});
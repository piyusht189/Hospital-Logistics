import React, { Component } from 'react';
import { SafeAreaView, Text, View, Alert, PermissionsAndroid, Image, Linking } from 'react-native';
import { Dimensions } from 'react-native';
import { Button, Divider, Layout, TopNavigation, TopNavigationAction, Toggle, Card, List, Modal, IndexPath, Select, SelectItem} from '@ui-kitten/components';
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast';
import BackgroundJob from 'react-native-background-job';
import {  Tab } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomMarker from "./customMarker";
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
import { StackActions } from 'react-navigation';
import {BackAndroid} from 'react-native'
import messaging from '@react-native-firebase/messaging';
import {
  AccessibilityRole,
  ImageProps,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  Text as RNText,
} from "react-native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light, dark } from "@eva-design/eva";
import Geolocation from 'react-native-geolocation-service';
import moment from "moment";
import 'moment-timezone';
import 'moment/min/moment-with-locales'
import { mapStyle } from './mapStyle'
import { NavigationActions } from 'react-navigation';
import Tabs from './tabs';
import KeepAwake from 'react-native-keep-awake';

//Import basic component from React Native
import SwipeButton from 'rn-swipe-button';
var timer
const backgroundJob = {
  jobKey: "myJob",
  job: () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        let value = await AsyncStorage.getItem('user');
        value = JSON.parse(value);
        let token = value.token ? value.token : '';
          if(position && position['coords'] && position['coords']['latitude']){
                  fetch('https://drivecraftlab.com/backend_gis/api/driver/driver_loc_submit.php?token=' + token, {
                      method: 'POST',
                      body: JSON.stringify({
                        did: value.aadid,
                        latitude: position['coords']['latitude'],
                        longitude: position['coords']['longitude']
                      })
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if(responseJson.status_code == 200){
                        console.log("Pinged : ", JSON.stringify(position['coords']))
                    }else{
                        console.log("GPS Error: ", responseJson.message)
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
            }

      },
      (error) => {
        // See error code charts below.
        console.log("Error from background here: ", error.message);
      },
      {enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000}
     );
      
  }
 };
  
 BackgroundJob.register(backgroundJob);
  
 



 let ScreenHeight = Dimensions.get("window").height;
 let ScreenWidth = Dimensions.get("window").width;


class DashboardScreen extends Component {
  token
  inputRefs = [];
  did_holder
  value
  state = {
    checked: false,
    selectedIndex: 0,
    drives: [],
    visible: false,
    drivePoints: {},
    drivePoints1: {},
    trackChanges: false,
    loading: false,
    polyline: { show: false, coordinates: [] },
    polyline1: { show: false, coordinates: [] },
    enroute_data: {enroute: false, work_log: {}},
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
    index: 0,
    work_key: -1,
    work_holder : {},
    showVehicles: false,
    vehicles: [],
    selected_vehicle: 0,
    selected_vehicle_name: '',
    hid: null,
    current_vehicle: 0,
    cirrent_vehicle_name : '',
    completed_flag: false
  } 
  static navigationOptions = ({ navigation }) =>  {
    return {
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={navigation.getParam('_getDrives')}>
          <Image
              source={require('../assets/images/reloadbtn.png')}
              style={{ width: 20, height: 20, marginRight: 15 }}
          />
      </TouchableOpacity>
    </View>
    )
   }
  };

  componentWillUnmount() {
   
  //  BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  async componentDidMount(){
    KeepAwake.activate();
    this.props.navigation.setParams({ _getDrives: this.getDrives });
   // BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
    value = await AsyncStorage.getItem('user');
    value = JSON.parse(value);
    this.did_holder = value.aadid;
    this.hid = value.hid;
    this.token = value.token;
    this.getDrives();
    fetch('https://drivecraftlab.com/backend_gis/api/ambulance_driver/driver_status_get.php?token=' + this.token, {
                method: 'POST',
                body: JSON.stringify({
                  did: value.aadid
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if(responseJson.status_code == 200){
                this.setState({checked: responseJson.status == 'online' ? true : false });
                if(responseJson.status == 'online'){
                  BackgroundJob.cancel({jobKey: 'myJob'})
                  .then(() => {})
                  .catch(err => console.err(err));
                  var backgroundSchedule = {
                    jobKey: "myJob",
                    exact: true,
                    period:4000,
                    allowExecutionInForeground: true,
                    allowWhileIdle: true
                   } 
                  BackgroundJob.schedule(backgroundSchedule)
                    .then(() =>  Toast.show("Job started", Toast.LONG))
                    .catch(err => console.err(err));
                }
              }else if(responseJson.status_code == 800){
                this.logoutRequest();
              }else{
                Toast.show(responseJson.message, Toast.LONG);
                this.setState({checked: false});
              }
            })
            .catch((error) => {
              console.error(error);
            });   
  }
  
getVehicles(hid){
  fetch('https://drivecraftlab.com/backend_gis/api/vehicles/get_available_vehicles.php?token=' + this.token, {
      method: 'POST',
      body: JSON.stringify({
        hid: this.hid
        //hid: 100
      })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    
    if(responseJson.status_code == 200){
      if(responseJson.vehicles.length){
        this.setState({vehicles : responseJson.vehicles});
      }else{
        this.setState({vehicles : []});
      }
      this.setState({ current_vehicle: 0,cirrent_vehicle_name: '',selected_vehicle:0,selected_vehicle_name: '', loading: false,showVehicles: true });
    }else if(responseJson.status_code == 800){
      this.logoutRequest();
    }else{
      this.setState({ loading: false });
      Toast.show(responseJson.message, Toast.LONG);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}  
getDrives = (flag) => {
    fetch('https://drivecraftlab.com/backend_gis/api/task/get_tasks.php?token=' + this.token, {
        method: 'POST',
        body: JSON.stringify({
          did: value.aadid
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      
      if(responseJson.status_code == 200){
        if(responseJson.drives.length){
          let resume = false;
          let resume_key;
          responseJson.drives = responseJson.drives.map((e,i) => {
            e['work_log'] = JSON.parse(e['work_log']);
           /* if(i == 0){
              e['type'] = 'start'
            }else if(responseJson.drives.length-1 == i){
              e['type'] = 'end'
            }else{
              e['type'] = 'mid'
            }*/
            if(e['status'] == 'enroute'){
              resume = true;
              resume_key = i;
            }
            if(e['vehicle']){
              this.setState({cirrent_vehicle_name : e['vehicle']['dvnumber'] + " -> " + e['vehicle']['dvname'] + ' (' + e['vehicle']['dvcolor'] + ')', current_vehicle: e['vehicle']['dvid']});
            }
            return e;
          });
          console.log("here data ", responseJson.drives);
          this.setState({drives : responseJson.drives.reverse()});
          if(resume && !flag){
            let reversed = responseJson.drives.reverse();
            this.resumeDrive(reversed[resume_key]);
            
          }else{
            if(!flag){
              this.setState({selectedIndex: 1});
            }
          }
        }else{
          this.setState({drives : []});
        }
        
      }else if(responseJson.status_code == 800){
        this.logoutRequest();
      }else{
        Toast.show(responseJson.message, Toast.LONG);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  resumeDrive(item){
    this.setState({selectedIndex : 0, work_holder: item});
    let work_key_temp = -2;;
    //Fetch current workkey
    Object.keys(item.work_log).forEach((e,i) => {
      if(!item.work_log[e]['reached']){
        if(work_key_temp == -2){
          work_key_temp = parseInt(e);
          if(work_key_temp == 0){
            work_key_temp = -1;
          }else{
            work_key_temp = work_key_temp - 1;
          }
        }
      }
    })
    if(this.state.checked){
      this.setState({work_key: work_key_temp, enroute_data: {enroute: true, work_log: item.work_log}});
     // this.step1(item.work_log);
     setTimeout(() => {

      this.step2(1);
     },500)
    }else{
      setTimeout(() => {
        this.switchService(true);
        setTimeout(()=>{
          this.setState({work_key: work_key_temp, enroute_data: {enroute: true, work_log: item.work_log}});
          setTimeout(()=>{
            this.step2(1);
          },500)
        },500)
      },500)
    }
  }

  startDrive(item){

    //Allow or not to resume ride
    let allow = true;
    this.state.drives.forEach(e => {
      if(e['status']=='enroute'){
        allow = false;
      }
    })
    if(allow){
      
    this.setState({selectedIndex : 0, work_holder: item, cirrent_vehicle_name: '', current_vehicle : 0});
    if(this.state.checked){
      this.setState({work_key: -1, enroute_data: {enroute: true, work_log: item.work_log}});
      setTimeout(() => {
        this.step1(item.work_log);
      },500)
    }else{
      setTimeout(() => {
        this.switchService(true);
        setTimeout(()=>{
          this.setState({work_key: -1, enroute_data: {enroute: true, work_log: item.work_log}});
          setTimeout(()=>{
           this.step1(item.work_log);
         },500)
        },500)
      },500)
    }
   }else{
     Alert.alert("You have one incomplete drive, you can first complete it or reject it!")
   }
  }
  
  async componentWillMount() {
    //this.requestLocationPermission2()
    }
  async requestLocationPermission() 
    {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Location Access',
            'message': 'Allow access to location'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          
        } else {
          // Logout
          Alert.alert("Location must be allowed to use the app");
        }
      } catch (err) {
        console.warn(err)
      }
    }
    async requestLocationPermission1() 
    {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            'title': 'Location Access',
            'message': 'Allow access to location'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          
        } else {
          // Logout
          Alert.alert("Location must be allowed to use the app");
          this.logoutRequest();
        }
      } catch (err) {
        console.warn(err)
      }
    }
    async requestLocationPermission2() 
    {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            'title': 'Location Access',
            'message': 'Allow access to location'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          
        } else {
          // Logout
        //  Alert.alert("Location must be allowed to use the app");
        //  this.logoutRequest();
        }

        granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

          if (granted) {
            console.log( "You can use the ACCESS_FINE_LOCATION" )
          } 
          else {
            Alert.alert("Location must be allowed to use the app");
        //  this.logoutRequest();
          }
      } catch (err) {
        console.warn(err)
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
  async switchService(checked,flag){
    if(flag){
      this.setState({loading: false});
    }else{
      this.setState({checked: checked});
    }
    let value = await AsyncStorage.getItem('user');
          value = JSON.parse(value);
    if(checked){
      // Enable Service
      try {
        this.requestLocationPermission();
        await AsyncStorage.setItem('job_status',"true");
        var backgroundSchedule = {
          jobKey: "myJob",
          exact: true,
          period: 10000,
          allowExecutionInForeground: true,
          allowWhileIdle: true
         }        
        BackgroundJob.schedule(backgroundSchedule)
        .then(() =>  {
          
          fetch('https://drivecraftlab.com/backend_gis/api/ambulance_driver/driver_status_update.php?token=' + this.token, {
                      method: 'POST',
                      body: JSON.stringify({
                        did: value.aadid,
                        status: 'online',
                      })
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if(responseJson.status_code == 200){
                      Toast.show("Job started", Toast.LONG)
                    }else if(responseJson.status_code == 800){
                      this.logoutRequest();
                    }else{
                      Toast.show(responseJson.message, Toast.LONG)
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
        })
        .catch(err => console.err(err));
       } catch (e) {
          Toast.show(e.message, Toast.LONG);
      }
    }else if(flag == 1){
      Toast.show("You are currently online!", Toast.LONG);
      this.setState({selectedIndex: 1,polyline1: {show: false, coordinates : []}, drivePoints1:{}, trackChanges: false, enroute_data: {enroute: false, work_log: {}}});
      this.getDrives(1);
    }else{
      //Disable Service

      if(timer){
        clearTimeout(timer);
      }
      try {
        BackgroundJob.cancel({jobKey: 'myJob'})
          .then(() => {
            fetch('https://drivecraftlab.com/backend_gis/api/ambulance_driver/driver_status_update.php?token=' + this.token, {
              method: 'POST',
              body: JSON.stringify({
                did: value.aadid,
                status: 'offline',
              })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.status_code == 200){
              Toast.show("Job stopped", Toast.LONG);
              this.setState({selectedIndex: 1,polyline1: {show: false, coordinates : []}, drivePoints1:{}, trackChanges: false, enroute_data: {enroute: false, work_log: {}}});
              this.getDrives(1);
            }else if(responseJson.status_code == 800){
              this.logoutRequest();
            }else{
              Toast.show(responseJson.message, Toast.LONG)
            }
          })
          .catch((error) => {
            console.error(error);
          });
          })
          .catch(err => console.err(err));
        await AsyncStorage.setItem('job_status',"false");
       } catch (e) {
          Toast.show(e.message, Toast.LONG);
      }
    }
  }


  getFormatted(data){
    return data ? moment.utc(data,'YYYY-MM-DD HH:mm:ss').tz('Asia/Kuwait').format('DD/MM/YYYY hh:mm A') : 'NA'
  }
  viewDrive(work_log){
    this.setState({polyline: {show: false, coordinates : []}})
    var polyline = [];
    Object.keys(work_log).forEach(e => {
      polyline.push({latitude: parseFloat(work_log[e]['lat']), longitude: parseFloat(work_log[e]['lng'])});
    })
    this.setState({trackChanges:true, visible: true, drivePoints: work_log, polyline: { show: true, coordinates: polyline}});
    setTimeout(() => {
      this.setState({trackChanges:false})
      this.map.fitToCoordinates(polyline, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
    },1500)
  }
  ActiveIcon = () => (
    <Icon name='map' size={18} iconStyle={{ marginBottom: 0 }} color='#272c36'/>
  );
  
  TodayIcon = () => (
    <Icon name='car' size={20} iconStyle={{  marginBottom: 0 }} color='#272c36'/>
  );
 
  Footer = (data) => (
    <View style={styles.footerContainer}>
      <Button style={styles.button} appearance='outline' size='small' onPress={() => this.viewDrive(data.item.work_log)} status='primary'>
      View Drive
      </Button>
      {data.item.status == 'enroute' &&
      <Button style={styles.button} appearance='outline' size='small' status='info' onPress={() => this.resumeDrive(data.item)}>
          Resume Drive
      </Button>
      }
      {data.item.status == 'pending' &&
      <Button style={styles.button} appearance='outline' size='small' status='success' onPress={() => this.startDrive(data.item)}>
          Start Drive
      </Button>
      }
    </View>
  );

 

  getFormatted1(val){
    return val ? moment(val,"HH:mm").format("hh:mm A") : 'NA';
  }

  renderItem = (info) => (
     <Card style={styles.item} footer={() => this.Footer(info)}>
     <View>
       <Text style={{fontSize: 16, fontWeight:'700'}}>{ info.item.work_log['0']['message'] + ' -> ' +  info.item.work_log['1']['message'] + '...'}</Text>
       <Text style={{fontSize: 13}}>Assigned on { this.getFormatted(info.item.assigned_time) }</Text>
       <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
       {info.item.type &&
          <Text style={{fontSize: 13 , backgroundColor: '#00a0a0',  borderRadius: 25, paddingTop: 3, paddingBottom: 2, paddingHorizontal: 12, marginTop: 7}}> 
            <Text style={{ color: '#fff'  }}>{ info.item.type ? 'Planned' : 'Regular' }</Text>
         </Text>
       }
       {info.item.type &&  info.item.start_time && 
       <Text style={{ marginTop: 10 }}>---</Text>
       }
       {info.item.type &&  info.item.start_time && 
            <Text style={{ borderWidth:1, borderColor: '#00a0a0', borderRadius: 25, paddingTop: 3, paddingBottom: 2, paddingHorizontal: 12, color: '#444', marginTop: 7, marginLeft: 0, fontWeight: '700'  }}>{ 'At ' + this.getFormatted1(info.item.start_time)}</Text>
       }
      {!info.item.type &&
        <Text style={{fontSize: 13 , backgroundColor: '#0386d4',  borderRadius: 25, paddingTop: 3, paddingBottom: 6, paddingHorizontal: 12, marginTop: 7}}>
           <Text style={{ color: '#fff' }}>{ info.item.type ? 'Planned' : 'Regular' }</Text>
        </Text>
      }
         </View>
     </View>
     </Card>
  );
 
  setRef = (ref) => {
    this.inputRefs.push(ref);
  };

  callbackFunction = (childData) => {
    if(timer){
      clearTimeout(timer);
    }
    this.setState({selectedIndex: childData, polyline1: {show: false, coordinates : []}, drivePoints1:{}, trackChanges: false, enroute_data: {enroute: false, work_log: {}}})
  }
  step1(work_log, flag){
    this.setState({polyline1: {show: false, coordinates : []}})
    var polyline = [];
    Object.keys(work_log).forEach(e => {
      polyline.push({latitude: parseFloat(work_log[e]['lat']), longitude: parseFloat(work_log[e]['lng'])});
    })
    this.setState({trackChanges:true,  drivePoints1: work_log, polyline1: { show: true, coordinates: polyline}});
    timer = setTimeout(() => {
      this.setState({trackChanges:false})
      this.map1.fitToCoordinates(polyline, { edgePadding: { top: 90, right: 90, bottom: 90, left: 90 }, animated: true });
    },1000)
  }
  step3(){
    let work_key = this.state.work_key;
    if(work_key == -1){
      this.setState({loading: true});
      this.getVehicles();
    }else{
      this.step2();
    }
  }
  step2(flag){
      
      let work_key = this.state.work_key;
      let work_holder = this.state.work_holder;
      Geolocation.getCurrentPosition(
        async (position) => {
          
            if(position && position['coords'] && position['coords']['latitude']){
             
              if(work_key == -1){
                
                // Current location to first location
                  if(flag){
                    this.setState({polyline1: {show: false, coordinates : []}, drivePoints1 : {}});
                    var polyline = [];
                    polyline.push({latitude: parseFloat(position['coords']['latitude']), longitude: parseFloat(position['coords']['longitude'])});
                    polyline.push({latitude: parseFloat(work_holder['work_log']['0']['lat']), longitude: parseFloat(work_holder['work_log']['0']['lng'])});
                    let drivePoints1 = {};
                    drivePoints1['0'] = {lat: position['coords']['latitude'], lng: position['coords']['longitude'], message: "Your Location", phone: ''}
                    drivePoints1['1'] = {lat: parseFloat(work_holder['work_log']['0']['lat']), lng: parseFloat(work_holder['work_log']['0']['lng']), message: work_holder['work_log']['0']['message'], phone: ''}

                    this.setState({trackChanges:true,  drivePoints1: drivePoints1, polyline1: { show: true, coordinates: polyline}});
                    this.setState({work_key : '0', loading: false});
                    timer = setTimeout(() => {
                      this.setState({trackChanges:false})
                      this.map1.fitToCoordinates(polyline, { edgePadding: { top: 90, right: 90, bottom: 90, left: 90 }, animated: true });
                    },1000);
                  }else{
                    this.setState({loading : true});
                    fetch('https://drivecraftlab.com/backend_gis/api/task/plot_task.php?token=' + this.token, {
                        method: 'POST',
                        body: JSON.stringify({
                          pointer: 'init',
                          tid: work_holder.atid,
                          lat: position['coords']['latitude'],
                          lng: position['coords']['longitude'],
                          dvid: this.state.current_vehicle
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                     
                      if(responseJson.status_code == 200){
                          this.setState({polyline1: {show: false, coordinates : []}, drivePoints1 : {}});
                          var polyline = [];
                          polyline.push({latitude: parseFloat(position['coords']['latitude']), longitude: parseFloat(position['coords']['longitude'])});
                          polyline.push({latitude: parseFloat(work_holder['work_log'][responseJson.work + '']['lat']), longitude: parseFloat(work_holder['work_log'][responseJson.work + '']['lng'])});
                          let drivePoints1 = {};
                          drivePoints1['0'] = {lat: position['coords']['latitude'], lng: position['coords']['longitude'], message: "Your Location", phone: ''}
                          drivePoints1['1'] = {lat: parseFloat(work_holder['work_log'][responseJson.work + '']['lat']), lng: parseFloat(work_holder['work_log'][responseJson.work + '']['lng']), message: work_holder['work_log'][responseJson.work + '']['message'], phone: ''}

                          this.setState({trackChanges:true,  drivePoints1: drivePoints1, polyline1: { show: true, coordinates: polyline}});
                          this.setState({work_key : responseJson.work + '', loading: false});
                          timer = setTimeout(() => {
                            this.setState({trackChanges:false})
                            this.map1.fitToCoordinates(polyline, { edgePadding: { top: 90, right: 90, bottom: 90, left: 90 }, animated: true });
                          },1000);
                          
                      }else if(responseJson.status_code == 800){
                        this.logoutRequest();
                      }else{
                        this.setState({loading : false});
                          console.log("Error: ", responseJson.message)
                      }
                    })
                    .catch((error) => {
                      this.setState({loading : false});
                      console.error(error);
                    });
                  }

                  }else{
                    // Latest location to next location or End Drive
                    if(flag){
                          let work_key_plus = work_key + 1;
                          var polyline = [];
                          polyline.push({latitude: parseFloat(position['coords']['latitude']), longitude: parseFloat(position['coords']['longitude'])});
                          polyline.push({latitude: parseFloat(work_holder['work_log'][work_key_plus + '']['lat']), longitude: parseFloat(work_holder['work_log'][work_key_plus + '']['lng'])});
                          let drivePoints1 = {};
                          drivePoints1['0'] = {lat: position['coords']['latitude'], lng: position['coords']['longitude'], message: "Your Location", phone: ''}
                          drivePoints1['1'] = {lat: parseFloat(work_holder['work_log'][work_key_plus + '']['lat']), lng: parseFloat(work_holder['work_log'][work_key_plus + '']['lng']), message: work_holder['work_log'][work_key_plus + '']['message'], phone: ''}
                          this.setState({trackChanges:true,  drivePoints1: drivePoints1, polyline1: { show: true, coordinates: polyline}});
                          timer = setTimeout(() => {
                            this.setState({trackChanges:false})
                            this.map1.fitToCoordinates(polyline, { edgePadding: { top: 90, right: 90, bottom: 90, left: 90 }, animated: true });
                          },1000);
                          this.setState({work_key : work_key_plus, loading: false});
                    }else{
                      this.setState({loading : true});
                    fetch('https://drivecraftlab.com/backend_gis/api/task/plot_task.php?token=' + this.token, {
                        method: 'POST',
                        body: JSON.stringify({
                          pointer: work_key,
                          tid: work_holder.atid,
                          lat: position['coords']['latitude'],
                          lng: position['coords']['longitude'],
                          dvid: this.state.current_vehicle,
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                      if(responseJson.status_code == 200){
                          this.setState({polyline1: {show: false, coordinates : []}, drivePoints1 : {}});
                          let drivePoints1 = {};

                          if(responseJson.work == 'completed'){
                            //Completed
                            this.switchService(false,1);
                            Alert.alert("Trip Completed!");
                          }else{
                            //Next work
                            var polyline = [];
                            polyline.push({latitude: parseFloat(position['coords']['latitude']), longitude: parseFloat(position['coords']['longitude'])});
                            polyline.push({latitude: parseFloat(work_holder['work_log'][responseJson.work + '']['lat']), longitude: parseFloat(work_holder['work_log'][responseJson.work + '']['lng'])});

                            drivePoints1['0'] = {lat: position['coords']['latitude'], lng: position['coords']['longitude'], message: "Your Location", phone: ''}
                            drivePoints1['1'] = {lat: parseFloat(work_holder['work_log'][responseJson.work + '']['lat']), lng: parseFloat(work_holder['work_log'][responseJson.work + '']['lng']), message: work_holder['work_log'][responseJson.work + '']['message'], phone: ''}
                            this.setState({trackChanges:true,  drivePoints1: drivePoints1, polyline1: { show: true, coordinates: polyline}});
                            timer = setTimeout(() => {
                              this.setState({trackChanges:false})
                              this.map1.fitToCoordinates(polyline, { edgePadding: { top: 90, right: 90, bottom: 90, left: 90 }, animated: true });
                            },1000);
                            this.setState({work_key : responseJson.work, loading: false});
                          }                         
                         
                         
                      }else if(responseJson.status_code == 800){
                        this.logoutRequest();
                      }else{
                        this.setState({loading : false});
                          Alert.alert(responseJson.message)
                      }
                    })
                    .catch((error) => {
                      this.setState({loading : false});
                      console.error(error);
                    });
                   }
                  } 
              }
        },
        (error) => {
          // See error code charts below.
          this.setState({loading : false});
          console.log("Error from background here: ", error.message);
        },
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 }
       );
   
  }
  startNavigation(){
    let lat,lng;
    lat = this.state.work_holder['work_log'][this.state.work_key]['lat'];
    lng = this.state.work_holder['work_log'][this.state.work_key]['lng'];
    Linking.openURL('https://maps.google.com/?daddr='+lat+','+lng);
  }
  setVehicle(){
    if(this.state.selected_vehicle <= 1){
      Toast.show("Select vehicle first!",Toast.LONG);
    }else{
     this.setState({showVehicles: false});
     this.step2();
    }
  }
  selectVehicle(index){
    let name = '';
    let current_vehicle = 0;
    if(index == 1){
      name = 'Select Vehicle';
      current_vehicle = 0;
    }else{
      let index_main = index - 2;
      name = this.state.vehicles[index_main]['dvnumber'] + ' -> ' + this.state.vehicles[index_main]['dvname'] + ' (' + this.state.vehicles[index_main]['dvcolor'] + ')';
      current_vehicle = this.state.vehicles[index_main]['dvid'];
    }
    this.setState({selected_vehicle: index, selected_vehicle_name: name, current_vehicle: current_vehicle, cirrent_vehicle_name: name});

  }
  gotToMyLocation(){
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (this.map2) {
          this.map2.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          })
        }
      },
      (error) => alert('Error: Are location services on?'),
      { enableHighAccuracy: true }
    )
  }
  render() {
    const thumbIcon = () => <Icon name='angle-double-right' size={20} iconStyle={{ marginLeft: 20 }} color='#fff' />;
    return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
          visible={this.state.loading}
          overlayColor={'#aaaaaaff'}
          textContent={'Hold on...'}
          textStyle={styles.spinnerTextStyle}
        />
       <Tabs parentCallback = {this.callbackFunction} selectedIndex={this.state.selectedIndex}>
          {/* First tab */}
          <View title="Active Drive" style={styles.content} active={this.state.selectedIndex == 0}>
                <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', height: ScreenHeight - 132, width: ScreenWidth }}>
                {!this.state.enroute_data.enroute && 
                    <View style={[styles.mapContainer2, { zIndex: 1, backgroundColor: '#000', flexDirection: 'column' }]}>
                    <MapView  showsMyLocationButton={true} showsUserLocation={true}  customMapStyle={mapStyle} showsTraffic={true} ref="map2" style={[styles.map1, {  zIndex: this.state.isInfoModalVisible ? 9 : 0 }]} rotateEnabled={false} ref={(el) => this.map2 = el} onMapReady={() => this.gotToMyLocation()}>
                         
                      </MapView>
                    </View>
                  }
                {!this.state.enroute_data.enroute &&
                    <View style={{ position:'absolute',bottom:0,right:0,left:0, flexDirection: 'row', padding:20, margin: 20, backgroundColor: '#fff', width: ScreenWidth - 50, borderRadius: 25, justifyContent: 'center' }}>
                    <Text style={{ marginRight: 20, marginTop: 5 }}>Job Status : </Text>
                    <Toggle checked={this.state.checked} onChange={checked => this.switchService(checked)}>
                      </Toggle>
                    </View>
                }
                {this.state.enroute_data.enroute &&
                    <View style={{ flexDirection: 'row', padding:5,height:50, backgroundColor: '#fff', width: ScreenWidth, justifyContent: 'center', top: 0, position: 'absolute', right: 0, left: 0, borderWidth: 1, borderColor: '#272c36' }}>
                    <Text style={{ marginRight: 20, marginTop: 7 }}>Job Status : </Text>
                    <Toggle checked={this.state.checked} onChange={checked => this.switchService(checked)}>
                      </Toggle>
                    </View>
                }
                {this.state.enroute_data.enroute && 
                    <View style={[styles.mapContainer1, { zIndex: 1, backgroundColor: '#000', flexDirection: 'column' }]}>
                    <MapView  showsMyLocationButton={true} showsUserLocation={true}  customMapStyle={mapStyle} showsTraffic={true} ref="map1" style={[styles.map1, {  zIndex: this.state.isInfoModalVisible ? 9 : 0 }]} rotateEnabled={false} ref={(el) => this.map1 = el}>
                          {Object.keys(this.state.drivePoints1).length > 0 &&
                              Object.keys(this.state.drivePoints1).map((key, index) => (
                                  <Marker ref={this.setRef} tracksViewChanges={this.state.trackChanges} key={this.state.drivePoints1[key].lat + this.state.drivePoints1[key].message} coordinate={{ latitude: parseFloat(this.state.drivePoints1[key].lat), longitude: parseFloat(this.state.drivePoints1[key].lng) }}
                                      anchor={{ x: 0.5, y: 0.3 }}>
                                      <CustomMarker message={this.state.drivePoints1[key].message} phone={this.state.drivePoints1[key].phone} type={index == 0 ? 'start' : Object.keys(this.state.drivePoints1).length - 1 == index ? 'end' : 'mid'}/>
                                  </Marker>
                              ))
                          }

                          {this.state.polyline1.show && <Polyline
                                    coordinates={this.state.polyline1.coordinates}
                                    strokeColor="#008E7C"
                                    lineDashPattern={[47.12]}
                                    strokeWidth={3}
                                />
                                }
                      </MapView>
                          {parseInt(this.state.work_key) >= 0 &&  
                            <View style={{ position:'absolute', bottom: 55, right: 15, zIndex: 9 }}>
                              <TouchableOpacity onPress={() => {this.startNavigation()}}
                                      style={{ right: 0, justifyContent: 'flex-end', alignSelf: 'flex-end'}}>
                                      <Image style={{ width: 60, height:60  }} resizeMode='contain' source={require('../assets/images/startnavigation.png')} />
                              </TouchableOpacity>
                            </View>
                          }
                      </View>
                  }
                  
                 
                  {this.state.enroute_data.enroute && 
                  <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0, backgroundColor: '#272c36' }}>
                      <Text style={{color: '#fff', height: 40, textAlign:'center', textAlignVertical: 'center'}}>{ this.state.cirrent_vehicle_name ? 'Vehicle: ' + this.state.cirrent_vehicle_name : 'Swipe Below' }</Text>
                      <SwipeButton
                      disabled={false}
                      swipeSuccessThreshold={70}
                      height={45}
                      title={ this.state.work_key == -1 ? "Swipe to Start the Drive" : this.state.enroute_data['work_log'][this.state.work_key]['message']}
                      titleFontSize = {12}
                      thumbIconComponent={thumbIcon}
                      shouldResetAfterSuccess = {true}
                      onSwipeSuccess={() => {
                        this.step3();
                      }}
                      railFillBackgroundColor="#272c3655" //(Optional)
                      railFillBorderColor="#272c36" //(Optional)
                      thumbIconBackgroundColor="#272c36" //(Optional)
                      thumbIconBorderColor="#272c36" //(Optional)
                      railBackgroundColor="#eee" //(Optional)
                      railBorderColor="#272c36" //(Optional)
                    />
                    </View>
                }
                </Layout>
          </View>
          {/* Second tab */}
          <View title="Today's Drives" style={styles.content} active={this.state.selectedIndex == 1}>
          {this.state.drives.length == 0 &&
             <Text style={{ flex: 1, margin: 20, textAlign: 'center' }}>No drives for today.</Text>
          }
          {this.state.drives.length != 0 &&
              <List
              contentContainerStyle={styles.contentContainer}
              data={this.state.drives}
              renderItem={this.renderItem}
            />
           }
          </View>

        </Tabs>
      {/*<TabView
      selectedIndex={this.state.selectedIndex}
      onSelect={index => this.setState({selectedIndex: index})}>
      <Tab title='Active Drive' icon={this.ActiveIcon}  style={{flex: 1}}>
      
      </Tab>
      <Tab title="Today's Drives" icon={this.TodayIcon} style={{flex: 1}}>
         
      </Tab>
      </TabView>*/}
     <Modal
        style={{padding:20, width: ScreenWidth-30, backgroundColor: '#fff', borderRadius: 25 }}
        visible={this.state.showVehicles}
        backdropStyle={styles.backdrop}
        >
          <Layout style={styles.container} level='1'>  
          {this.state.vehicles.length == 0 &&
          <Text style={{  margin: 20, textAlign: 'center' }}>No Available Vehicles.</Text>
          }
          {this.state.vehicles.length > 0 &&
          <Text style={{  margin: 20, textAlign: 'center', color: 'black' }}>Select Vehicle</Text>
          }
          {this.state.vehicles.length > 0 &&
            <Select
              selectedIndex={this.state.selected_vehicle}
              value={this.state.selected_vehicle_name}
              placeholder='Select Vehicle'
              onSelect={index => this.selectVehicle(index)}>
                <SelectItem title='Select Vehicle'/>
                {this.state.vehicles.map(e => (
                  <SelectItem title={ e['dvnumber']  + ' -> ' +e ['dvname'] + ' (' + e['dvcolor'] + ')' }/>
                 ))
                }
            </Select>
          }
          </Layout>
          
          <View style={{flexDirection: 'row', marginTop: 20}}>
          {this.state.vehicles.length > 0 &&
          <Button style={{flex:1, marginRight: 10}} onPress={() => this.setVehicle()}>
            Start Drive
          </Button>
          }
          <Button status='basic' style={{flex:1}} onPress={() => {this.setState({showVehicles: false});this.switchService(false);}}>
            Cancel
          </Button>
          </View>
      </Modal>
    <Modal
        style={{flex:1, height: ScreenHeight-100, width: ScreenWidth-30 }}
        visible={this.state.visible}
        backdropStyle={styles.backdrop}
        >
        <View disabled={true} style={{flex:1, position:'relative', backgroundColor:'#fff'}}>
        <View style={[styles.mapContainer, { zIndex: 1, backgroundColor: '#000', flexDirection: 'column' }]}>
                    <MapView  showsMyLocationButton={true} showsUserLocation={true}  customMapStyle={mapStyle} showsTraffic={true} ref="map" style={[styles.map, {  zIndex: this.state.isInfoModalVisible ? 9 : 0 }]} rotateEnabled={false} ref={(el) => this.map = el}>
                        {Object.keys(this.state.drivePoints).length > 0 &&
                            Object.keys(this.state.drivePoints).map((key, index) => (
                                <Marker ref={this.setRef} tracksViewChanges={this.state.trackChanges} key={this.state.drivePoints[key].lat + this.state.drivePoints[key].message} coordinate={{ latitude: parseFloat(this.state.drivePoints[key].lat), longitude: parseFloat(this.state.drivePoints[key].lng) }}
                                    anchor={{ x: 0.5, y: 0.3 }}>
                                    <CustomMarker message={this.state.drivePoints[key].message} phone={this.state.drivePoints[key].phone} type={index == 0 ? 'start' : Object.keys(this.state.drivePoints).length - 1 == index ? 'end' : 'mid'}/>
                                </Marker>
                            ))
                        }

                         {this.state.polyline.show && <Polyline
                                  coordinates={this.state.polyline.coordinates}
                                  strokeColor="#008E7C"
                                  lineDashPattern={[47.12]}
                                  strokeWidth={3}
                              />
                              }

                        
                    </MapView>
          </View>
          <Button style={{ position: 'absolute', bottom:1, right: 0, left: 0 }} onPress={() => this.setState({visible: false})}>
            Okay
          </Button>
        </View>
      </Modal>
    
    </SafeAreaView>
  );
  }
};


export default DashboardScreen;

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
    marginTop: -7,
    alignSelf: 'center'
  },
  button: {
    margin: 2,
    padding: 0,
    flex:1
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 50
},
mapContainer1: {
  position: 'absolute',
  top: 50,
  left: 0,
  right: 0,
  bottom: 100
},
mapContainer2: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 100
},
map: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
},
map1: {
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
  backgroundColor: '#fff',         // Darker background for content area
},

});
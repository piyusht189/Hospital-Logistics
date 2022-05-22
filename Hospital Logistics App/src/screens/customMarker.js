import React, { Component } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image, CheckBox, Icon, ActivityIndicator, Linking } from 'react-native'

class CustomMarker extends Component {
    state = {
        
    }    
    render() {
        return (
                <View style={styles.extraComponentContainer}>
                    <View style={styles.labelcontainer}>
                        <Text style={styles.label}>{this.props.message}</Text>
                        {this.props.phone != '' && 
                        <Text style={styles.label}>Phone# <Text onPress={()=>{Linking.openURL('tel:' + this.props.phone);}}>{this.props.phone}</Text></Text>
                        }
                    </View>
                    {this.props.type == 'start' &&
                        <Image resizeMode='contain' style={styles.marker} source={require('../assets/images/dotstart.png')} />
                    }
                    {this.props.type == 'mid' &&
                        <Image resizeMode='contain' style={styles.marker} source={require('../assets/images/dotmid.png')} />
                    }
                    {this.props.type == 'end' &&
                        <Image resizeMode='contain' style={styles.marker} source={require('../assets/images/dotend.png')} />
                    }
                </View>
        )
    }
}
export default CustomMarker;
const styles = StyleSheet.create({
    marker: {
        width: 30,
        height: 30,
        marginBottom: 34,
        flex:1,
        zIndex: 9
    },
    extraComponentContainer: {
        // fakes overflow but requires more markup
        backgroundColor: "#eeeeee04",
        paddingTop: 37,
        paddingLeft: 150,
        paddingBottom: 80,
        paddingRight: 150,
        position: "relative"
    },
    labelcontainerGreen: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: 'green',
        padding: 5,
        position: 'absolute',
        top: 0,
        right: 190,
        minWidth: 120,
        maxWidth: 200
    },
    labelcontainerRed: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: 'red',
        padding: 5,
        position: 'absolute',
        top: 0,
        right: 190,
        minWidth: 120,
        maxWidth: 200
    },
    labelcontainerEnd: {
        width: 10,
        height: 10,
        borderBottomColor: '#007bff',
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderLeftWidth: 15,
        right: -1,
        bottom: -1,
        position: 'absolute'
    },
    label: {
        paddingBottom: 5,
        color: '#272c36',
        fontSize: 12
    },
  
 
    labelcontainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        position: 'absolute',
        top: 0,
        right: 190,
        minWidth: 120,
        maxWidth: 200
    }
})

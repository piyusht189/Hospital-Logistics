import { View } from 'react-native';
import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
export default class NavigationDrawerStructure extends Component {
    //Structure for the navigatin Drawer


    toggleDrawer = () => {
            this.props.navigationProps.toggleDrawer();
    };
    setLoaded() {
        loaded = "true";
    }
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                    <Image
                        source={require('../assets/images/drawer.png')}
                        style={{ width: 25, height: 25, marginLeft: 10 }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
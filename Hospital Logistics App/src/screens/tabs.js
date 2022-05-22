import React, { Component } from 'react';
import {
  StyleSheet,         // CSS-like styles
  Text,               // Renders text
  TouchableOpacity,   // Pressable container
  View,                // Container component
  Alert
} from 'react-native';

export default class Tabs extends Component {

    // Pull children out of props passed from App component
    render({ children } = this.props) {
      return (
        <View style={styles.container}>
          {/* Tabs row */}
          <View style={styles.tabsContainer}>
            {/* Pull props out of children, and pull title out of props */}
            {children.map(({ props: { title, active} }, index) =>
              <TouchableOpacity
                style={[
                  // Default style for every tab
                  styles.tabContainer,
                  // Merge default style with styles.tabContainerActive for active tab
                  active  ? styles.tabContainerActive : []
                ]}
                // Change active tab
                onPress={() => {this.props.parentCallback(index)} }
                // Required key prop for components generated returned by map iterator
                key={index}
              >
                <Text style={styles.tabText}>
                  {title}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Content */}
          <View style={styles.contentContainer}>
            {children[this.props.selectedIndex]}
          </View>
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
container:{flex:1},
   // Tabs row container
   tabsContainer: {
    flexDirection: 'row',               // Arrange tabs in a row
  },
  // Individual tab container
  tabContainer: {
    flex: 1,                            // Take up equal amount of space for each tab
    paddingVertical: 15,                // Vertical padding
    borderBottomWidth: 3,               // Add thick border at the bottom
    borderBottomColor: 'transparent',   // Transparent border for inactive tabs
  },
  // Active tab container
  tabContainerActive: {
    borderBottomColor: '#272c36',       // White bottom border for active tabs
  },
  // Tab text
  tabText: {
    color: '#272c36',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Content container
  contentContainer: {
    flex: 1                             // Take up all available space
  }
});
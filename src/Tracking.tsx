import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';

/**
 * Tracking Component
 */
class Tracking extends React.Component {
  componentDidMount = () => {
    console.log('Tracking Component is Mounted...');
  };

  // 34.923908
  // 138.390012

  render = () => {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 34.923908,
            longitude: 138.390012,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    );
  };
}

export default Tracking;

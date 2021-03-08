import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import BackgroundGeolocation, {
  Location,
  LocationError,
  MotionChangeEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
} from 'react-native-background-geolocation';

type State = {
  locations: Location[];
};

/**
 * Tracking Component
 */
class Tracking extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      locations: [],
    };
  }

  componentDidMount = () => {
    console.log('Tracking Component is Mounted...');

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange);

    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        // Activity Recognition
        stopTimeout: 1,
        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      },
      (state) => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );

        if (!state.enabled) {
          ////
          // 3. Start tracking!
          //
          BackgroundGeolocation.start(function () {
            console.log('- Start success');
          });
        }
      },
    );
  };

  //   componentDidMount = () => {
  //     console.log('Tracking Component is Mounted...');
  //   };

  componentWillUnmount = () => {
    BackgroundGeolocation.removeListeners();
  };

  onLocation = (location: Location) => {
    console.log('[location] -', location);
    this.setState({
      locations: [...this.state.locations, location],
    });
  };

  onError = (error: LocationError) => {
    console.warn('[location] ERROR -', error);
  };

  onActivityChange = (event: MotionActivityEvent) => {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  };

  onProviderChange = (provider: ProviderChangeEvent) => {
    console.log('[providerchange] -', provider.enabled, provider.status);
  };

  onMotionChange = (event: MotionChangeEvent) => {
    console.log('[motionchange] -', event.isMoving, event.location);
  };

  render = () => {
    const {locations} = this.state;
    if (locations.length === 0) return null;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 34.960017984220684,
            longitude: 138.40492520422208,
            latitudeDelta: 0.0461,
            longitudeDelta: 0.0215,
          }}>
          {locations?.map((l: Location, i: number) => {
            return (
              <Marker
                key={`marker_${i}`}
                coordinate={{
                  ...l.coords,
                }}
              />
            );
          })}
        </MapView>
      </View>
    );
  };
}

export default Tracking;

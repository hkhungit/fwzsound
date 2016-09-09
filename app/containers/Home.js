import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { navigate } from '../navigators'
import Button       from 'react-native-button'

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to
        </Text>
        <Text style={styles.welcome}>
          Fwz Sound Management
        </Text>
        <View style={styles.navBar}>
          <Button text="Player" style={styles.btn} onPress={()=>navigate(this, 'player')}/>
          <Button text="Recorder" style={styles.btn} onPress={()=>navigate(this, 'recorder')}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },

  welcome: {
    margin: 10,
    fontSize: 20,
    textAlign: 'center',
  },

  navBar: {
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
  },

  btn: {
    flex: 1,
    alignItems: 'center',
  }
});

export default Home

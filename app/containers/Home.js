import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  NativeModules
} from 'react-native';
import { navigate } from '../navigators'
import Button       from 'react-native-button'
//f3b190ea31e81a860f53326e2f8a92da  
class Home extends Component {
  render() {
    const { ReactNativeAudioStreaming } = NativeModules;
    ReactNativeAudioStreaming.stop();
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.coverLogo}>
            <Text style={styles.textLogo}> Fs </Text>
          </View>
          <Text style={styles.textSlogan}> Make & Player Your Sound </Text>
        </View>
        <View style={styles.navBar}>
          <Button text="Player" style={styles.btn} styleText={styles.btnText} onPress={()=>navigate(this, 'player')}/>
          <Button text="Recorder" style={styles.btn} styleText={styles.btnText} onPress={()=>navigate(this, 'recorder')}/>
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

  coverLogo: {
    width: 200,
    height: 200,
    marginTop: -100,
    borderRadius: 120,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
  },

  textLogo: {
    fontSize: 120,
    color: '#FFF',
  },

  textSlogan: {
    padding: 10,
    marginTop: 10,
    color: 'red',
  },

  btnText:{
    color: 'red'
  },

  welcome: {
    margin: 10,
    fontSize: 20,
    textAlign: 'center',
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    margin: 5,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});

export default Home

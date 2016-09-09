import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Button       from 'react-native-button'

class BottomBar extends Component {
  render() {
    const { navigate } = this.props
    return (
      <View style={styles.navBar}>
        <Button text="Player" style={styles.btn} onPress={()=>navigate('player')}/>
        <Button text="Recorder" style={styles.btn} onPress={()=>navigate('player')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default FwzSound

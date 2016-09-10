import React, { Component } from 'react'
import { Navigator }        from 'react-native'
import Router               from './navigators'

class FwzSound extends Component {
  render() {
    return (
      <Navigator
        ref="navigator"
        initialRoute={{name: 'home'}}
        renderScene={Router.renderScene}
      />
    );
  }
}

export default FwzSound

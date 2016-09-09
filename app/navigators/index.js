import { 
  Navigator 
} from 'react-native'
import {
  Home,
  Player, 
  Recorder,
} from '../containers'
import React          from 'react'

export default {
  renderScene(route, navigator) {
    switch(route.name) {
      case 'home':
        return <Home navigator={navigator}  />      
      case 'player':
        return <Player navigator={navigator}  />
      case 'recorder':
        return <Recorder navigator={navigator}  />
    }
  }
}

export const navigate = (classObj, routeName, params={}) => {
  classObj.props.navigator.push({
    name: routeName,
    ...params
  })
}
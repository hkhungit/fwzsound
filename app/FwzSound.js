import React, { Component } from 'react'
import { 
  Text,
  Navigator, 
  ActivityIndicator,
  TouchableHighlight
} from 'react-native'
import Router               from './navigators'
import Storage              from 'react-native-storage';

class FwzSound extends Component {
  constructor(){
    super()
    this.state = {
      connected: false,
      routes: null,
      currentId: 0,
    }

    this.fetchRoute = this.fetchRoute.bind(this)
  }

  componentWillMount() {
    cache = new Storage({defaultExpires: 1000 * 3600 * 24 * 1000})
    cache.load({
      key: 'routes'
    }).then(this.fetchRoute)
    .catch(err =>{
      this.setState({connected: true, routes: null})
    })

    let timeour = setInterval(() => {
      if (this.state.connected) {
        clearInterval(timeour)
      }
    }, 100)
  }

  fetchRoute(data){
    const { routes , currentId } =  data
    this.setState({connected: true, routes, currentId: currentId ? currentId : 0})
  }

  configureScene(route, routeStack){
     return Navigator.SceneConfigs.FloatFromBottom 
  }

  render() {
    const { connected, routes } =  this.state
    const currentId = this.state.currentId < 2 ? 1 : this.state.currentId - 1

    if (!connected)
      return(
        <ActivityIndicator
            animating={true}
            style={{height: 100, alignSelf: 'center'}}
            size="large"
        />
      )

    if (routes && currentId)
      return (
        <Navigator
          ref="navigator"
          initialRoute={routes[currentId]}
          initialRouteStack={routes}
          renderScene={Router.renderScene}
          />
      );

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

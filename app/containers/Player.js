import React from 'react';
import {
  Text,
  View,
  Image,
  Switch,
  Slider,
  Platform,
  StyleSheet,
  NativeModules,
} from 'react-native';
import Moment     from 'moment';
import Button     from 'react-native-button';
import Icon       from 'react-native-vector-icons/FontAwesome';

let options = {
  title: "We Don't Talk Anymore",
  author: "Charlie Puth",
  singer: "Charlie Puth",
  lyric: "unknown",
  thumb_url: 'http://image.mp3.zdn.vn/covers/1/9/191486d4ba699a1ce061251e53767546_1471003295.jpg',
}
class AppMediaPlayer extends React.Component {
  constructor() {
    super();

    this.state = {
      looped: false,
      progress: 0,
      position: 0,
      error: null,
      isPlaying: false,
      ...options
    };

    this.onSeek = this.onSeek.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onRepeat = this.onRepeat.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onPlayback = this.onPlayback.bind(this);
  }

  _seek(percent){

  }

  _renderPlayback(){
    const { isPlaying } =  this.state
    if (isPlaying)
      return <Icon name="pause-circle" size={20} color="#FFFFFF" />
    return <Icon name="play-circle" size={20} color="#FFFFFF" />
  }

  onStop(){
    
  }

  onSeek(){
    
  }

  onNext(){
    
  }

  onRepeat(){
    const { looped } = this.state
    this.setState({looped: !looped})
  }

  onPrevious(){
    
  }

  onPlayback(){

  }

  render() {
    let position = Moment.utc(this.state.position * 1000).format("mm:ss")
    return (
      <View style={styles.container}>
        <Button style={styles.btnBack} onPress={() => this.props.navigator.pop()}>
          <Icon name="hand-o-left" size={16} />
        </Button>
        <View style={[styles.borderBottom]}>
          <Text style={styles.title}>
            Media Player
          </Text>
        </View>
        <View style={[styles.component, styles.borderBottom]}>
          <View style={[styles.header, styles.borderBottom]}>
            <View>
              <Image style={styles.thumb} source={{uri: this.state.thumb_url}} />
            </View>
            <View style={styles.info}> 
              <Text>Song: {this.state.title}</Text>
              <Text>Author: {this.state.author}</Text>
              <Text>Singer: {this.state.singer}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text>{this.state.lyric}</Text>
          </View>
        </View>
        <View>
          <View style={styles.sliderPlayer}>
            <Text style={{alignSelf: 'center'}}>0</Text>
            <View style={styles.slider}>
              <Slider step={0.0001} onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress}/>
            </View>
            <Text style={{alignSelf: 'center'}}> {position} </Text>
          </View>
          <View style={styles.controll}>
            <Button style={styles.button} onPress={this.onPlayback}>
              {this._renderPlayback()}
            </Button>
            <Button style={styles.button} onPress={this.onStop} >
              <Icon name="stop-circle" size={20} color="#FFFFFF" />
            </Button>
            <Button style={[styles.button, this.state.looped && styles.active]} onPress={this.onRepeat}>
              <Icon name="repeat" size={20} color="#FFFFFF" />
            </Button>
          </View>
        </View>
        <View>
          <Text style={styles.errorMessage}>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    position: 'relative',
    backgroundColor: '#F5FCFF',
  },

  component: {
    flex: 1,
  },

  borderBottom: {
    borderBottomWidth: 2,
    borderColor: '#6A6A6A'
  },

  header: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  info:{
    flex: 1,
    marginLeft: 10,
  },

  thumb: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  controll: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  sliderPlayer: {
    flexDirection: 'row', 
    margin: 10
  },

  button: {
    margin: 2,
    padding: 5,
    borderWidth: 0,
    paddingLeft: 7,
    paddingRight: 7,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  btnBack: {
    top: 35,
    left: 5,
    zIndex: 9,
    padding: 12,
    borderWidth: 0,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: '#DFDFDF'
  },


  active: {
    backgroundColor: '#3960ec'
  },

  btnText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#FFFFFF",
  },

  slider: {
    flex: 1,
    marginLeft: -5,
    marginRight: -10,
    ...Platform.select({
      ios: {
        marginLeft: 5,
        marginRight: 5,
      }
    })
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },

  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red'
  }
});

export default AppMediaPlayer;
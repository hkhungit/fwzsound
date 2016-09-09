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
import {
  Player,
  Recorder,
  MediaStates
} from 'react-native-audio-toolkit';

let options = {
  title: "Preparing.....",
  author: "Preparing.....",
}

let filename = "record.mp4"
class AppMediaRecorder extends React.Component {
  constructor() {
    super();

    this.state = {
      looped: false,
      progress: 0,
      position: 0,
      error: null,
      isRecord: false,
      isPlaying: false,
      disableBtnRecord: false,
      disableBtnStop: false,
      disableBtnPlay: false,
      progress: 0,
      position: 0,
      error: null,
      filepath: null,
      ...options
    };

    this.onSeek = this.onSeek.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onRepeat = this.onRepeat.bind(this);
    this.onPlayback = this.onPlayback.bind(this);
  }

  _renderPlayback(){
    const { isPlaying } =  this.state
    if (isPlaying)
      return <Icon name="pause-circle" size={20} color="#FFFFFF" />
    return <Icon name="play-circle" size={20} color="#FFFFFF" />
  }

  onStop(){
    if (this.state.disableBtnStop)
      return
    
    this.player.stop(() => {
      this._reload();
    });
  }

  onSeek(percentage){
    if (!this.player)
      return;

    let position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._reload();
    });
  }

  onRepeat(){
    const looped = !this.state.looped
    this.setState({looped})
    if (this.player)
      this.player.looping = looped;
  }

  onRecord(){
    if (this.state.disableBtnRecord)
      return

    if (this.player)
      this.player.destroy();

    this.recorder.toggleRecord((err, stopped) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }

      this.setState({isRecord: true})
      if (stopped) {
        this.initPlayer();
        this.initRecorder();
        this.setState({isRecord: false})
      }

      this._reload();
    });
  }

  onPrevious(){
    
  }

  onPlayback(){
    if (this.state.disableBtnPlay)
      return

    this.player.playPause((err, playing) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      this._reload();
    });
  }

  _reload(){
    this.setState({
      isPlaying:        this.player    && this.player.isPlaying     ? true : false,
      isRecord:         this.recorder  && this.recorder.isRecording ? true : false,
      disableBtnStop:   !this.player   || !this.player.canStop,
      disableBtnPlay:   !this.player   || !this.player.canPlay || this.recorder.isRecording,
      disableBtnRecord: !this.recorder || (this.player         && !this.player.isStopped),
    });
  }

  initPlayer(){
    if (this.player)
      this.player.destroy()

    this.player = new Player(filename, {autoDestroy: false}).prepare((error)=>{
      this.setState({error})
      this._reload();
    });

    this.player.on("progress", (data)=>{
      let currentTime = data.currentTime;
      this.setState({progress: Math.max(0,  currentTime) / this.player.duration, position: currentTime});
    })    

    this.player.on("ended", ()=>{
      this._reload();
    })

    this._reload();
  }

  initRecorder(){
    if (this.recorder)
      this.recorder.destroy();

    this.recorder = new Recorder(filename, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: 'max'
    }).prepare((error, res)=>{
      if (error)
        return this.setState(error)
      const { filepath }  = res
      this.setState({filepath})
    });

    this.recorder.on("progress", (data)=>{
      let currentTime = data.currentTime;
      this.setState({position: currentTime});
    })

    this._reload();
  }

  componentWillMount() {
    this.initPlayer();
    this.initRecorder();
  }

  render() {
    let position = Moment.utc(this.state.position).format("mm:ss")
    return (
      <View style={styles.container}>
        <Button style={styles.btnBack} onPress={() => this.props.navigator.pop()}>
          <Icon name="hand-o-left" size={16} />
        </Button>
        <View style={[styles.borderBottom]}>
          <Text style={styles.title}>
            Media Recorder
          </Text>
        </View>
        <View style={[styles.component, styles.borderBottom]}>
          <View style={[styles.header, styles.borderBottom]}>
            <View style={styles.info}> 
              <Text>Name: {this.state.title}</Text>
              <Text>Author: {this.state.author}</Text>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button style={[styles.btnRecord, this.state.isRecord && styles.isRecord]} onPress={this.onRecord} >
              <Icon name="microphone" size={100} color="#FFFFFF" />
            </Button>
            {this.state.isRecord && <Text style={{margin: 10}}> {position} </Text>}
            {!this.state.isRecord && <Text style={{margin: 10}}> 00:00 </Text>}
          </View>
        </View>
        <View>
          <View style={styles.sliderPlayer}>
            <Text style={{alignSelf: 'center'}}>0</Text>
            <View style={styles.slider}>
              <Slider step={0.0001} onValueChange={this.onSeek} value={this.state.progress}/>
            </View>
            {!this.state.isRecord && <Text style={{margin: 10}}> {position} </Text>}
            {this.state.isRecord && <Text style={{margin: 10}}> 00:00 </Text>}
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
    alignItems: 'center',
    justifyContent: 'center'
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

  btnRecord: {
    margin: 2,
    padding: 30,
    borderWidth: 0,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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

  isRecord: {
    borderColor: '#bf0610',
    backgroundColor: '#f0000c',
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

export default AppMediaRecorder;
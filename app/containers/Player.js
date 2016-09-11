import React from 'react';
import {
  Text,
  View,
  Image,
  Switch,
  Slider,
  Platform,
  ListView,
  TextInput,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
  ActivityIndicator,
  DeviceEventEmitter,
  NativeAppEventEmitter,
} from 'react-native';
import Moment     from 'moment';
import Button     from 'react-native-button';
import Icon       from 'react-native-vector-icons/FontAwesome';
import Env        from '../../env'

const { CLIENT_ID } = Env
const { ReactNativeAudioStreaming } = NativeModules;

let options = {
  title: "Preparing...",
  author: "Preparing...",
  singer: "Preparing...",
  lyric: "Preparing...",
  streaming_url: null,
}
const thumb_url = "http://image.mp3.zdn.vn/covers/1/9/191486d4ba699a1ce061251e53767546_1471003295.jpg"
class AppMediaPlayer extends React.Component {
  constructor() {
    super();

    this.state = {
      dataSource: null,
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
    this.onSearch = this.onSearch.bind(this);
    this.onPrevious   = this.onPrevious.bind(this);
    this.onPlayback   = this.onPlayback.bind(this);
    this.renderTrack  = this.renderTrack.bind(this);
    this.handleEvent  = this.handleEvent.bind(this);

    let appEventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;

    appEventEmitter.addListener('AudioBridgeEvent', this.handleEvent)
  }

  handleEvent(data){
    const { status } = data
    switch(status){
      case "PLAYING":
        return this.onStarted(data);
      case "STREAMING":
        return this.onStreaming(data);
      case "STOPPED":
        this.setState({isPlaying: false, position: 0, duration: 0});
        return;
      case "PAUSED":
        this.setState({isPlaying: false});
        return;
      case "BUFFERING":
        return;
      case "ERROR":
        this.setState({isPlaying: false, position: 0, duration: 0});
        return;
      case "METADATA_UPDATED":
        return;
    }
  }

  onStarted(data){
    this.setState({isPlaying: true});
  }  

  onStreaming(data){
    let duration = data.duration && data.duration > 0 ? data.duration : 0.001;
    let position = data.progress;
    let progress = Math.max(0,  position) / duration
    this.setState({progress, position, duration});
  }

  _renderPlayback(){
    const { isPlaying } =  this.state
    if (isPlaying)
      return <Icon name="pause-circle" size={20} color="#FFFFFF" />
    return <Icon name="play-circle" size={20} color="#FFFFFF" />
  }

  onStop(){
    ReactNativeAudioStreaming.stop();
  }

  onSeek(percentage){
    let position = percentage * this.state.duration;

    ReactNativeAudioStreaming.seekToTime(position)
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
    const { isPlaying, streaming_url } = this.state
    isPlaying ? ReactNativeAudioStreaming.pause() : ReactNativeAudioStreaming.play(streaming_url)
  }

  onPlaySong(data){
    this.setState({
      title: data.title,
      streaming_url: `${data.stream_url}?client_id=${CLIENT_ID}`,
      author: data.user.username,
      singer: data.user.username,
      thumb_url: data.artwork_url || thumb_url
    })

    ReactNativeAudioStreaming.play(`${data.stream_url}?client_id=${CLIENT_ID}`)
  }

  onSearch(){
    this.setState({dataSource: null})
    const { textSeach } = this
    if (textSeach) {
      const q = encodeURI(textSeach)
      fetch(`https://api.soundcloud.com/tracks?linked_partitioning=1&client_id=${Env.CLIENT_ID}&limit=50&offset=0&filter=public&q=${q}`)
      .then((response) => response.json())
      .then((response) => {
        this.fetchTrack(response.collection)
      })
      .catch((error) => {
        this.setState({error: error.message})
      });
    }
  }

  onChange(text){
    this.textSeach = text
  }

  componentWillMount() {
    fetch(`https://api.soundcloud.com/tracks?linked_partitioning=1&client_id=${Env.CLIENT_ID}&limit=50&offset=0&filter=public`)
      .then((response) => response.json())
      .then((response) => {
        this.fetchTrack(response.collection)
      })
      .catch((error) => {
        this.setState({error: error.message})
      });
  }

  fetchTrack(tracks){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSource: ds.cloneWithRows(tracks)})
  }

  renderTrack(data){
    let image = data.artwork_url || '../assets/images/logo.png';
    let created_at = Moment(data.user.created_at).format("DD MMM, YYYY");
    let title = data.title && data.title.length > 20 ? data.title.substr(0, 20) +"..." : data.title;

    let description = data.description && data.description.length > 50 ? data.description.substr(0, 50) : data.description
    return(
      <View style={styles.item}>
        <View style={styles.imgCover}>
          <TouchableOpacity onPress={this.onPlaySong.bind(this, data)}>
            <Image source={{uri: image}} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity onPress={this.onPlaySong.bind(this, data)}>
            <Text style={styles.title}>{title} -  {data.user.username}</Text>
          </TouchableOpacity>
          <View style={styles.caption}>
            <Text style={styles.captionItem}><Icon name="cloud-download" size={16} color="#6A6A6A" />  {data.download_count}</Text>
            <Text style={styles.captionItem}><Icon name="calendar" size={16} color="#6A6A6A" />  {created_at}</Text>
          </View>     
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    )
  }

  render() {
    let position = Moment.utc(this.state.position * 1000).format("mm:ss")
    return (
      <View style={styles.container}>
        <View style={styles.dialog}>
          <TextInput onChangeText={this.onChange.bind(this)} ref="txtSearch" style={styles.textInput} />
          <Button style={styles.btnSearch} onPress={this.onSearch}>
            <Icon name="search" size={16}  color="#6A6A6A" />
          </Button>
        </View>
        <Button style={styles.btnBack} onPress={() => this.props.navigator.pop()}>
          <Icon name="hand-o-left" size={16} />
        </Button>
        <View style={[styles.borderBottom]}>
          <Text style={styles.titlePage}>
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
            { !this.state.dataSource && <ActivityIndicator
                animating={true}
                style={{height: 100, alignSelf: 'center'}}
                size="large"
            />}
            { this.state.dataSource && <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderTrack}
            />}
          </View>
        </View>
        <View>
          <View style={styles.sliderPlayer}>
            <Text style={{alignSelf: 'center'}}>0</Text>
            <View style={styles.slider}>
              <Slider step={0.0001} onValueChange={this.onSeek} value={this.state.progress}/>
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
    ...Platform.select({
      android: {
        paddingTop: 0,
      }
    }),
    position: 'relative',
    backgroundColor: '#F5FCFF',
  },

  component: {
    flex: 1,
  },

  dialog: {
    borderWidth: 2,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#9A9A9A',
    backgroundColor: '#F5FCFF'
  },

  textInput:{
    flex: 1,
    height: 40,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 0,
    color: '#6A6A6A',
    backgroundColor: 'transparent'
  },

  btnSearch: {
    padding: 12,
    paddingLeft: 0,
    borderWidth: 0,
    borderRadius: 30,
    alignSelf: 'center',
    backgroundColor: 'transparent'
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
    marginLeft: -20,
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
    left: 5,
    zIndex: 9,
    padding: 12,
    marginTop: 10,
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

  titlePage: {
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
  },

  item: {
    margin: 5,
    marginBottom: 0,
    paddingBottom: 5,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#6A6A6A'
  },

  imgCover: {
    width: 100,
    height: 100,
  },

  image: {
    flex: 1,
    width: 100,
    height: 100,
  },

  caption: {
    flexDirection: 'row'
  },

  captionItem: {
    marginRight: 5,
  },

  content: {
    flex: 1,
    padding: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  description: {

  }
});

export default AppMediaPlayer;
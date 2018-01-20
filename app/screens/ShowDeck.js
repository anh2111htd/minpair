import React, { Component } from "react";
import { View, ScrollView, Text, Linking, TouchableWithoutFeedback, WebView } from 'react-native';
import { List, ListItem, Card, ButtonGroup, Button, Badge, normalize, Header, Icon, h1, colors } from 'react-native-elements';

import { calculate, getDayDiff, getPercentOverdue, BASE_DATE, BEST, CORRECT, WORST, splitDue, splitInSession } from '../components/SM2';

const MAX = 10;
const IN = 0;
const OUT = 1;
const LSHOW = 1;
const LSTART = 0;

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

const Option = ({word, playSound, onAnswer, disabled}) => (
    <ListItem
        leftIcon={{name:'volume-high', type:'material-community'}}
        leftIconOnPress={playSound}
        containerStyle={styles.containerListItem}
        rightIcon={{color:GREEN, name:'check-circle', type:'material-community'}} 
        onPressRightIcon={onAnswer}
        title={word}
        disabled={disabled}
        titleStyle={{
            fontSize:normalize(25),
            fontWeight:'bold',
            color:'#000000'}}
    />
);

const Heading = ({words, files, question, playSound, onAnswer, index, hasAnswered}) => (
    <View>
        <View style={styles.textContainer}>
            <Text></Text>
            <Text style={styles.firstText}> Which? ({index}/10)</Text>
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                <Text>Hear again</Text>
                <Icon
                    name='volume-high'
                    type='material-community'
                    size={20}
                    containerStyle={{margin: 10, height: 30, width:30}}
                    raised
                    color={GRAYD}
                    onPress={() => { playSound(files[question]);}} />
            </View>
        </View>
        <Option 
            word={words[0]} file={files[0]}
            disabled={hasAnswered}
            playSound={() => playSound(files[0])}
            onAnswer={() => onAnswer(0)}/>
        <Option 
            word={words[1]} file={files[1]}
            disabled={hasAnswered}
            playSound={() => playSound(files[1])}
            onAnswer={() => onAnswer(1)}/>
    </View>
);

const Loop = ({iconName, onPress, buttonTitle, title, color, disabled}) => (
    <View>
        <ListItem
            title={title}
            disabled={disabled}
            titleStyle={{color: '#ffffff', fontWeight:'bold'}}
            rightIcon={<Icon
                            onPress={onPress}
                            name={iconName}
                            raised/>}
            containerStyle={{
                backgroundColor:color,
                marginTop: 15,
                marginBottom: 0,
                borderBottomWidth: 0,
            }}
        />
    </View>
)

const Answer = ({onPress, buttons, title, desc, selectedIndex, color}) => (
    <Card 
        containerStyle={{
            margin: 0,
            backgroundColor: color,
            borderWidth:0,
        }}>
        <Text>{title}</Text>
        <Text>{desc}</Text>
        <ButtonGroup
            onPress={onPress}
            selectedIndex={selectedIndex}
            containerStyle={{marginTop: 20}}
            textStyle={{fontWeight: 'bold'}}
            component={TouchableWithoutFeedback}
            buttons={buttons}/>
    </Card>
)

class ShowDeck extends Component {
	constructor() {
		super();
		this.state = {
            isLoading: true,
            hasAnswered: false,
            words: ['Loading...', ''],
            files: ['', ''],
            selectedIndex: 0,
            loopTitle: 'Practice this pairs',
            loopButton: LSTART,
        }
        this.handlePressAction = this.handlePressAction.bind(this);
        this.handlePressStop = this.handlePressStop.bind(this);
        this.whoosh = 'first';
    }

	componentDidMount() {
        let TODAY = getDayDiff(BASE_DATE, new Date());
        var self = this;
		filename = this.props.navigation.state.params.filename;
        fs.readFile(`${dirs.DocumentDir}/MinPairs/${filename}`, 'utf8')
        	.then((content) => {
                // console.log(content);
                let inputCards = JSON.parse(content).note;    
                inputCards = splitInSession(inputCards, TODAY, MAX);
                if (inputCards[IN].length == 0) {
                    this.props.navigation.navigate('Home');
                }
                const {files, words} = inputCards[IN][0];
                self.setState({
                    ...this.state,
                    cards: inputCards[IN],
                    leftOver: inputCards[OUT],
                    isLoading: false,
                    words: words,
                    files: files,
                    index: 0,
                    question: Math.floor(Math.random() * 2),
                    isActive: JSON.parse(content).isActive,
                    today: TODAY,
                }, () => {
                    this.playSound(files[this.state.question]);
                });
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePressStop() {
        const { cards, leftOver, isActive } = this.state;
        console.log(cards);
        fs.writeFile(`${dirs.DocumentDir}/MinPairs/${filename}`, JSON.stringify({isActive: isActive, note: leftOver.concat(cards)}), 'utf8')
                    .catch(err => console.log(err));
    }

    handlePressAction(selectedIndex) {
        console.log(selectedIndex);
        const { index, cards } = this.state;
        var performanceRating;
        if (selectedIndex == 0) performanceRating = BEST;
        if (selectedIndex == 1) performanceRating = CORRECT;
        if (selectedIndex == 2) performanceRating = WORST;

        var newCards = cards;
        newCards[index] = calculate(cards[index], performanceRating, this.state.today);

        this.setState({
            ...this.state,
            cards: newCards,
        }, function() {
            var nextIndex = index + 1;
            if (nextIndex >= cards.length) {
                this.handlePressStop();
                this.props.navigation.navigate('Home');
                return;
            }            
            this.setState({
                ...this.state,
                index: nextIndex,
                words: cards[nextIndex].words,
                files: cards[nextIndex].files,
                question: Math.floor(Math.random() * 2),
                hasAnswered:false,
                loopTitle: 'Practice this pairs',
                loopButton: LSTART,
            }, () => {
                this.playSound(this.state.files[this.state.question]);
            });
        });
    }

    playSound = (fileName) => {
        // if (this.state.playing == true) return;
        if (!(this.whoosh == 'first')) this.whoosh.release();
        this.whoosh = new Sound(fileName[Math.floor(Math.random() * fileName.length)], Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            this.setState({
                ...this.state,
                playing: true,
            });
            // loaded successfully
            this.whoosh.play((success) => {
                this.setState({
                    ...this.state,
                    playing: false,
                });

                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                    // reset the player to its uninitialized state (android only)
                    // this is the only option to recover after an error occured and use the player again
                    
                }});
          }
        );
    }

	render() {
		var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }
        const { selectedIndex, index, files, words, hasAnswered, question } = this.state

        if (!this.state.hasAnswered) {
            return(
                <View style={styles.pageContainer}>
                    <View style={styles.form}>
                        <Heading    
                            words={words} files={files} index={index} question={question}
                            playSound={this.playSound}
                            onAnswer={(ans) => { this.setState({ ...this.state, hasAnswered: true, answer: ans }); }}/>
                    </View>
                </View>
            );

        } else {
            var loopComponent, resultComponent;
            let loopColor;
            if (this.state.answer == this.state.question) {
                loopColor=GREEN;
                resultComponent = <Answer
                                    title={`Correct. It\'s ${words[this.state.question]}.`}
                                    desc={'How many times did you need to hear?'}
                                    buttons={['1 or 2', 'More than 2']}
                                    onPress={() => {return this.handlePressAction(this.state.selectedIndex)}}
                                    selectedIndex={this.state.selectedIndex}
                                    color={GREENL}/>
            } else {
                loopColor=RED;
                resultComponent = <Answer
                                    title={`Incorrect. It\'s ${words[this.state.question]}.`}
                                    desc={'You may want to practice this pairs again.'}
                                    buttons={['Later']}
                                    onPress={() => {return this.handlePressAction(2)}}
                                    selectedIndex={this.state.selectedIndex}
                                    color={REDL}/>
            }

            if (this.state.loopButton == LSTART) {
                loopComponent = <Loop 
                                    title={this.state.loopTitle}
                                    iconName='play-arrow'
                                    color={loopColor}
                                    disabled={this.state.playing}
                                    onPress={() => {
                                        this.setState(
                                            {
                                                ...this.state,
                                                loopQuestion: Math.floor(Math.random() * 2),
                                                loopButton: LSHOW,
                                                loopTitle: 'Practice this pairs',
                                            }, () => { this.playSound(this.state.files[this.state.loopQuestion]); })}}/>
            } else {
                loopComponent = <Loop   
                                    title={this.state.loopTitle}
                                    iconName='remove-red-eye'
                                    color={loopColor}
                                    disabled={this.state.playing}
                                    onPress={() => {
                                        // console.log(this.state);
                                        this.setState({
                                            ...this.state,
                                            loopButton: LSTART,
                                            loopTitle: `It's ${words[this.state.loopQuestion]}.`,
                                        });
                                    }}/>
            }

            return (
            <View style={styles.pageContainer}>
                <View style={styles.form}>
                    <Heading    
                        words={words} files={files} index={index} question={question}
                        playSound={this.playSound}
                        hasAnswered={true}
                        onAnswer={(ans) => { this.setState({ ...this.state, hasAnswered: true, answer: ans }); }}/>
                    {loopComponent}
                    {resultComponent}
                </View>
                {/* <PerfButtons phonetic={phonetic} word={word} selectedIndex={selectedIndex} handlePressAction={this.handlePressAction}/> */}
            </View>
            );
        }}
}

const PURPLE='#7f47dd';
const GRAY='#f2f2f2';
const GRAYD='#cccccc';
const YELLOW='#fbb03b';
const GREEN='#22b573';
const GREENL='#c5f9dd';
const BG='#ffffff';
const RED='#edbe54';
const REDL='#eac994';

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    form: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    buttonArea: {
      flex: 1, 
      justifyContent: 'flex-end',
    },
    buttonRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    buttonStyle: {
      backgroundColor:GREEN,
    },
    buttonContainerStyle: {
        marginBottom: 0,
        marginRight:0,
        marginLeft:0,
        borderWidth:0,
        borderRadius:0,
        height:100,
    },
    innerBorderStyle: {
      // borderWidth: 0,
      color: '#000',
    },
    firstText: {
      color: '#000000',
      fontSize: normalize(20),
      fontWeight: 'bold',     
      borderBottomWidth: 0,  
    },
    textContainer: {
      height: 70,
      alignItems: 'center',
      justifyContent: 'center', 
    },
    containerListItem: {
        borderBottomWidth:15,
        borderTopWidth:10,
        borderColor:GRAY,
        borderBottomColor:GRAY,
        backgroundColor: GRAY,
        // borderBottomWidth:0,
        margin:10,
    },
  });

export default (ShowDeck);
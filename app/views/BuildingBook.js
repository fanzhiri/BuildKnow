/**
 * Created by slako on 17/2/18.
 *
 */
import React, { Component ,PropTypes} from 'react';

import {View, Text, Image, StyleSheet, SegmentedControlIOS,TouchableOpacity} from "react-native";

import Button from "react-native-button";

import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import {Menu,MenuOptions,MenuOption,MenuTrigger,renderers} from 'react-native-popup-menu'

const {SlideInMenu}=renderers;

import BookIntroduce from './BookIntroduce'
import BookDiscuss from './BookDiscuss'
import BookHistory from './BookHistory'

import GlobleStyles from '../styles/GlobleStyles';

var doGetBookUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbook";
var httpsBaseUrl = "https://slako.applinzi.com/";

var doGetBookQuestionUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbookquestion";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
        flexDirection:'row',
        height:160,
        flexDirection:'row',
    },
    container2: {
        flex: 2,
        marginLeft:10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    image:{
        flex:1,
        width:160,
        height:160,
        borderRadius:16,
    },
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    },
    button:{
        fontSize: 16,color: 'green' ,width:38,height:24, overflow:'hidden', borderRadius:4, backgroundColor: 'red'
    },
    textmargin:{
        marginTop:10,
    },
    ButtonViewContainer:{
        flex:1,
        justifyContent: 'flex-end',
    },
    bottomButtonViewContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        height: 32,
        alignItems: 'center',
    },
    bottomButtonText: {
        fontSize: 16,
    },
});

class BuildingBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0,
            bookdata:null,
            bookCover:null,
            getdata:0,
            question_arr:null
        };
        this._onChange = this._onChange.bind(this);
        this._handleRandom = this.handleRandom.bind(this);
        this._handleOrder = this.handleOrder.bind(this);
        this._handleSection = this.handleSection.bind(this);
        this._renderBook = this.renderBook.bind(this);
        this._renderLoading = this.renderLoading.bind(this);
        this._doFetchBook = this.doFetchBook.bind(this);
    }


    doFetchBook(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        bookdata:responseData.data,
                        bookCover:`${httpsBaseUrl}${responseData.data.cover}`,
                        getdata:1
                    })
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetchquestions(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookQuestionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){
                    /*
                    this.setState({
                        question_arr:responseData.data,
                    })
                    */
                    Actions.answerquestion({intype:0,asktype:1,buildingbookdata:responseData.data});
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    handleRandom() {
        var type = 'random';
        let bookqids=JSON.parse(this.state.bookdata.qids);
        this.dofetchquestions();

    }
    handleOrder() {
        var type = 'order';
        global.bookqids=JSON.parse(this.state.bookdata.qids);
        Actions.answerquestion(type);
    }
    handleSection() {
        var type = 'section';
        global.bookqids=JSON.parse(this.state.bookdata.qids);
        Actions.answerquestion(type);
    }

    handleBeginTest() {
        Actions.begintest({bookdata:this.state.bookdata});
    }

    renderBook(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>

                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={{uri:this.state.bookCover}}/>
                    </View>
                    <View style={styles.container2}>
                        <Button style={styles.button} onPress={() => this._handleRandom()} >随机</Button>
                        <Button style={styles.button} onPress={() => this._handleOrder()}>顺序</Button>
                        <Button style={styles.button} onPress={() => this._handleSection()}>章节</Button>
                    </View>
                    <View style={styles.container2}>
                        <Button style={styles.button} >错题</Button>
                        <Button style={styles.button} >收藏</Button>
                        <Button style={styles.button} onPress={() => this.handleBeginTest()} >测试</Button>
                    </View>
                </View>
                <View>
                    <SegmentedControlIOS
                        values={['介绍','评论','推荐','计划','历史']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}

            </View>
        );
    }

    render(){
        if(this.state.getdata == 0){
            this._doFetchBook();
            return this._renderLoading();
        }else{
            if(this.state.bookdata == null){
                return this.rendernodata()
            }else{
                return this._renderBook();
            }
        }
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {
            return (
                this.renderIntroduceView()
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderDiscussView()
            )
        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderIdeasView()
            )
        } else if (this.state.selectedIndex === 3) {
            return (
                this.renderHistoryView()
            )
        } else if (this.state.selectedIndex === 4) {
            return (
                this.renderHistoryView()
            )
        }

    }

    renderIntroduceView(){
        return (
            <View>
                <Text style={styles.textmargin}>题本名字 :{this.state.bookdata.bookname}</Text>
                <Text style={styles.textmargin}>题目数量 :{this.state.bookdata.q_count}</Text>
                <Text style={styles.textmargin}>题本简介 :{this.state.bookdata.bookbrief}</Text>
                <Text style={styles.textmargin}>题本详情 :{this.state.bookdata.bookdescription}</Text>
                <Text style={styles.textmargin}>题目编号 :{this.state.bookdata.qids}</Text>
                <Text style={styles.textmargin}>关注人数 :{this.state.bookdata.follow}</Text>
            </View>

        )
    }

    renderDiscussView(){
        return (
        <View style={styles.ButtonViewContainer}>
            <View style={styles.bottomButtonViewContainer}>

                <TouchableOpacity  onPress={()=> Actions.chatlist()} >
                    <Text style={styles.bottomButtonText} >评论</Text>
                </TouchableOpacity>

                <Text style={styles.bottomButtonText} >赞</Text>
            </View>
        </View>

        )
    }

    renderIdeasView(){
        return (
            <View style={styles.ButtonViewContainer}>
                <View style={styles.bottomButtonViewContainer}>
                    <TouchableOpacity  onPress={()=> Actions.newsomequestions({bookid:this.props.bookid,title:this.state.bookdata.bookname})} >
                        <Text style={styles.bottomButtonText} >贡献</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
    }

    renderLoading(){
        return (
            <Text>Loading ...</Text>
        )
    }

    rendernodata(){
        return (

                <Text>没有数据</Text>

        )
    }
}

BuildingBook.PropTypes = {
    bookid:PropTypes.number,
};

module.exports = BuildingBook;
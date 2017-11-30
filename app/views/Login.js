/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,AsyncStorage,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {GiftedForm, GiftedFormManager} from "react-native-gifted-form";
import g_storage from '../util/NativeStore';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

//var dologinpostUrl = "https://slako.applinzi.com/index.php?m=question&c=api&a=login";
var dologinpostUrl = "https://slako.applinzi.com/index.php?m=member&c=index&a=login";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username:'',
            passwd:'',
            loginresult:"no",
            code:0,
            savenamepasswd:false
        };
        this._dologin = this.dologin.bind(this);

    }
    dologin(name,passwd){
        let formData = new FormData();
        formData.append("username",name);
        formData.append("password",passwd);
        formData.append("dosubmit","true");
        formData.append("api","true");

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(dologinpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {

                this.setState({
                    code:responseData.code
                })
                if(responseData.code == 100){

                    if(this.state.savenamepasswd){
                        g_storage.save({
                            key: 'username',  // Note: Do not use underscore("_") in key!
                            id: '1',	  // Note: Do not use underscore("_") in id!
                            data: this.state.username,
                        });
                        g_storage.save({
                            key: 'passwd',  // Note: Do not use underscore("_") in key!
                            id: '2',	  // Note: Do not use underscore("_") in id!
                            data: this.state.passwd,
                        });
                    }else{
                        g_storage.remove({
                            key: 'passwd',  // Note: Do not use underscore("_") in key!
                            id: '2',	  // Note: Do not use underscore("_") in id!
                        });
                    }

                    /*
                    if(responseData.data){
                        storageSave("auth", responseData.data.auth);
                        storageSave("userid", responseData.data.userid);
                        storageSave("username", responseData.data.username);
                        storageSave("groupid", responseData.data.groupid);
                        storageSave("nickname", responseData.data.nickname);
                        storageSave("userhead", responseData.data.userhead);
                    }
                    */
                    global.auth=responseData.data.auth;
                    global.userid=responseData.data.userid;
                    global.username=responseData.data.username;
                    global.groupid=responseData.data.groupid;
                    global.nickname=responseData.data.nickname;
                    global.userhead=responseData.data.userhead;
                    global.adminid=responseData.data.adminid;
                    global.mydata=responseData.data.mydata;
                    //注意看下面！！如果数据库中该字段为空，使用JSON.parse会出错！！在数据库操作的php中，应该检查空并置为[]
                    global.followperson=JSON.parse(responseData.data.followperson);
                    global.friend=JSON.parse(responseData.data.friend);
                    global.bookcollect=JSON.parse(responseData.data.bookcollect);
                    global.qstcollect=JSON.parse(responseData.data.collectqst);

                    //注意看上面！！
                    global.infonum=responseData.data.infonum;
                    Actions.main();
                }else{
                    alert(responseData.code)
                    this.setState({
                        loginresult:responseData.code
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    componentDidMount(){

        g_storage.load({
            key: 'username',
            id: '1'
        }).then(ret => {
            // found data goes to then()
            this.setState({
                username:ret,
            });
        }).catch(err => {
            // any exception including data not found
            // goes to catch()

            switch (err.name) {
                case 'NotFoundError':
                    // TODO;

                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }

            this.setState({
                username:"",
            });
        });

        g_storage.load({
            key: 'passwd',
            id: '2'
        }).then(ret => {
            // found data goes to then()
            this.setState({
                passwd:ret,
            });
        }).catch(err => {
            // any exception including data not found
            // goes to catch()

            switch (err.name) {
                case 'NotFoundError':
                    // TODO;

                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }

            this.setState({
                passwd:"",
            });
        });
    }

    onSaveChange(){
        let savestate=this.state.savenamepasswd;
        if(savestate == true){
            savestate = false;
        }else{
            savestate = true ;
        }
        this.setState({
            savenamepasswd:savestate,
        });
    }

    renderSave(){
        return(
            <TouchableOpacity onPress={()=>this.onSaveChange()} >
                <View style={{height:48,flexDirection:"row",alignItems:"center",paddingLeft:24}}>
                    {this.renderSavebox()}
                    <Text style={{marginLeft:12}}>记住密码</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderSavebox(){
        if(this.state.savenamepasswd == true){
            return(
                <Icon name={"md-checkbox-outline"}  size={22} color="#008B00"/>
            )
        }else {
            return (
                <Icon name={"md-expand"} size={22} color="#008B00"/>
            )
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {/*<Text >{this.state.code}</Text>*/}
                <GiftedForm
                    keyboardShouldPersistTaps="always"
                    formName='loginForm'
                    clearOnClose={false}

                    defaults={{
                        //username: this.state.username,
                        //password: this.state.passwd,
                        username: 'fantexi',
                        password: 'fantexi',
                        //username: 'zi',
                        //password: 'zzzzzz',

                    }}
                    validators={{
                        username: {
                            title: 'Username',
                            validate: [{
                                validator: 'isLength',
                                arguments: [2, 16],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            },{
                                validator: 'matches',
                                arguments: /^[a-zA-Z0-9]*$/,
                                message: '{TITLE} can contains only alphanumeric characters'
                            }]
                        },
                        password: {
                            title: 'Password',
                            validate: [{
                                validator: 'isLength',
                                arguments: [6, 16],
                                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                            }]
                        },
                    }}
                >
                    <GiftedForm.TextInputWidget
                        name='username'
                        title='用户名'

                        placeholder='用户名'
                        clearButtonMode='while-editing'


                    />

                    <GiftedForm.TextInputWidget
                        name='password' // mandatory
                        title='密码'
                        placeholder='密码'
                        clearButtonMode='while-editing'
                        secureTextEntry={true}

                    />

                    <GiftedForm.ErrorsWidget />

                    <GiftedForm.SubmitWidget
                        title='登陆'
                        widgetStyles={{
                            submitButton: {
                                backgroundColor: '#00F000',
                            }
                        }}
                        onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                            if (isValid === true) {
                                // prepare object

                                /* Implement the request to your server using values variable
                                 ** then you can do:
                                 ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                                 ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                                 ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                                 */
                                this._dologin(values.username,values.password);
                                //postSubmit('An error occurred, please try again');
                                postSubmit();
                                //postSubmit(['Username already taken', 'Email already taken']);
                                //GiftedFormManager.reset('registerForm');
                                //this._dologin();
                            }

                        }}

                    />

                    <GiftedForm.HiddenWidget name='tos' value={true} />
                </GiftedForm>
                {this.renderSave()}


            </View>
        );
    }
}

module.exports = Login;
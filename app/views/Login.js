/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {GiftedForm, GiftedFormManager} from "react-native-gifted-form";
import {storageSave,storeageGet} from '../util/NativeStore';

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
            loginresult:"no",
            code:0
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
                    this.setState({
                        loginresult:"ok"
                    })
                    if(responseData.data){
                        storageSave("auth", responseData.data.auth);
                        storageSave("userid", responseData.data.userid);
                        storageSave("username", responseData.data.username);
                        storageSave("groupid", responseData.data.groupid);
                        storageSave("nickname", responseData.data.nickname);
                        storageSave("userhead", responseData.data.userhead);
                    }
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



    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {/*<Text >{this.state.code}</Text>*/}
                <GiftedForm
                    keyboardShouldPersistTaps="always"
                    formName='loginForm'
                    clearOnClose={false}

                    defaults={{
                        username: 'fantexi',
                        password: '',
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

                        placeholder='fantexi'
                        clearButtonMode='while-editing'


                    />

                    <GiftedForm.TextInputWidget
                        name='password' // mandatory
                        title='密码'
                        placeholder='fantexi'
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


            </View>
        );
    }
}

module.exports = Login;
import { withNavigationFocus } from 'react-navigation';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import styless from './style';
export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login   : '',
      password: '',
    }
  }

  onClickListener = (viewId) => {
    const {navigate} = this.props.navigation;
const login=this.state.login;
const password=this.state.password;
let user = {
  "name": login,
  "password": password
};
fetch('http://flatly.us-east-1.elasticbeanstalk.com/users', {
            method: "POST",
            headers: {
             crossDomain: true,
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        Accept: "application/json",
        'security_header': 'someExtremelyRandomCode!@#$%^&*()',
            },
            body: JSON.stringify(user)
        }).then(res => {

            const token=res.security_token
            console.log(res.id)//undifined
            const userid=res.id; // Setting the token in localStorage
            navigate('List',{userid})
            return Promise.resolve(res);
     
        });

  }

  render() {
    return (
      <View style={styles.container}>

<Text style={styless.logoText}>Flatly</Text>
           
     
   
        <View style={styles.inputContainer}> 
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>  
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#4B0082",
  },
  loginText: {
    color: 'white',
  }
});
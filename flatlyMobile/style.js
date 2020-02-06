const React = require("react-native");

const { StyleSheet } = React;

export default {

containerView: {
  flex: 1,
},
loginScreenContainer: {
  flex: 1,
  backgroundColor:"#E6E6FA"
},
logoText: {
  fontSize: 40,
  fontWeight: "800",
  marginTop: 10,
  marginBottom: 30,
  textAlign: 'center',
},
loginFormView: {
  flex: 1
},
loginFormTextInput: {
  height: 43,
  fontSize: 14,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#9370DB',
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,

},
loginButton: {
  backgroundColor: '#4B0082',
  borderRadius: 5,
  height: 45,
  marginTop: 10,
 },
 container: {
    flex: 1,
    alignItems: 'center',

  },
  item: {
    backgroundColor: '#66aa00',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 32,
  },
  itemStyle: {
    backgroundColor: '#66aa00',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
};




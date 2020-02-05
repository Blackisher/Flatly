import React from 'react';
import {TouchableHighlight, Button, SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import styles from './style';

import { withNavigationFocus } from 'react-navigation';
function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}


export default class ReservedFlatsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       bookings:[],
     flats:[]
  }
  }
  

componentWillMount(){

let userid='1'
//let userid =this.props.navigation.getParam('userid', '')///////userid is unfined
let theurl='http://flatly.us-east-1.elasticbeanstalk.com/bookings?id='+userid
 fetch(theurl)
                 .then((data) => data.json())
                 .then((bookings) => {
                     this.setState({ bookings: bookings })
                     const input=this.state.bookings
                 });


}
  
  render() {
const input =this.state.bookings;

const grouped=Object.values(input.reduce((a, { item_id, owner_of_booking,start_date,end_date }) => {
    if (!a[item_id]) a[item_id] = { item_id,data:[] };
    a[item_id].data.push([owner_of_booking,start_date,end_date]);
   return a;
  }, {}))
console.log(grouped)
  
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
      <Text></Text>
      <FlatList data={grouped} renderItem={({item}) => {
            return(
              <TouchableHighlight onPress={() => navigate('Detail',{item})}>
                    <Text style={styles.itemStyle}>Flat No.{item.item_id}</Text>
                </TouchableHighlight>
            )
          }
        }
        keyExtractor={item => item.id}/>
    </View>
    
    );
  }
}


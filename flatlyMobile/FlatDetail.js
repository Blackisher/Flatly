import React from 'react';
import {Button, SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import styles from './style';


export default class FlatDetail extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      data:[],
   

}
}

  componentWillMount(){
    const key =JSON.stringify(this.props.navigation.getParam('item', ''))

}


  render() {
 
    const key =JSON.stringify(this.props.navigation.getParam('item', ''))
    const { navigation } = this.props;
    const data  = this.props.flatdata;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reservations for {"\n"} Flat No. {JSON.parse(key).item_id} </Text>

        


   <FlatList data={JSON.parse(key).data} renderItem={({item}) => {
            return(
              
                    <Text style={styles.itemStyle}> Guest: {item[0]} {"\n"} Start Date:{item[1].substring(0,10)} {"\n"}End Date:{item[2].substring(0,10)}{"\n"} </Text>
            )
          }
        }
        keyExtractor={item => item.id}/>

      <Button
          title="Go back to list"
          onPress={() =>
            navigation.push('List', {
              itemId: Math.floor(Math.random() * 100),
            })
          }
        />
      </View>
    );
  }
}


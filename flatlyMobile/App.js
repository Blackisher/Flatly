import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ReservedFlatsList from './ReservedFlatsList';
import FlatDetail from './FlatDetail';
import Login from './Login';
const MainNavigator = createStackNavigator({
  Login :{screen :Login},
  List: {screen: ReservedFlatsList},
  Detail: {screen: FlatDetail},
});

const App = createAppContainer(MainNavigator);

export default App;
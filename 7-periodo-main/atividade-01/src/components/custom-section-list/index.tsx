import React from 'react';
import { Text, View, SectionList } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { styles } from './style';

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export function CustomSectionList() {
    return(
        <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
            <View style={styles.item}>
                <Text style={styles.title}>{item}</Text>
            </View>
            )}
            renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
            )}
      />
    );
}
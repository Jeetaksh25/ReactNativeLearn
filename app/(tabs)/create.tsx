import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gray } from 'tailwindcss/colors';

const Create = () => {
  return (
    <SafeAreaView style={{flex: 1,alignItems:"center",backgroundColor: gray[900]}}>
      <ScrollView style={{paddingHorizontal:6,}}>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Create
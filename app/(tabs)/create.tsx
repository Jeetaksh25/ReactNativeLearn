import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gray } from 'tailwindcss/colors';

const Create = () => {
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: gray[900]   }}>
      <Text>Create</Text>
    </SafeAreaView>
  )
}

export default Create
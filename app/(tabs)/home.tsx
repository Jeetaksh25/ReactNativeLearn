import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <SafeAreaView>
      <FlatList 
        data={[{ id: 1 }, { id: 2 },{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }]} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (  
          <Text style={{ fontSize: 20, color: 'black', padding: 10 }}>{item.id}</Text>
        )}
      />
    </SafeAreaView>
  )
}

export default Home

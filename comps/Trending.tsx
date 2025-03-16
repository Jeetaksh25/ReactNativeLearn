import { View, Text,FlatList } from 'react-native'
import React from 'react'

interface Props {
    posts: any
}

const Trending: React.FC<Props> = ({posts}) => {
  return (
    <FlatList data={posts} keyExtractor={(item) => item.id} renderItem={({item}) => <Text className='text-white text-2xl'>{item.id.toString()}</Text>} horizontal/>
  )
}

export default Trending
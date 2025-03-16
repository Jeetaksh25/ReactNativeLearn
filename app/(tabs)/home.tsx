import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "../../theme/theme";
import colors from "tailwindcss/colors";
import {images} from '../../constants'
import SearchInput from "../../comps/SearchInput";
import Trending from "../../comps/Trending";
import EmptyState from "../../comps/EmptyState";

const Home = () => {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async()=>{
    setRefreshing(true);
    //todo

    setRefreshing(false);

  }



  return (
    <SafeAreaView style={{backgroundColor: colors.gray[900] }} className="min-h-screen max-w-screen-full align-items-center">
      <FlatList
        data={[
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
        ]}
        keyExtractor={(item) => item.id.toString()}
        
        renderItem={({ item }) => (
          <Text style={{ fontSize: 20, color: "white", padding: 10 }}>
            {item.id}
          </Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-sm text-gray-100">Welcome Back</Text>

                <Text className="text-2xl font-semibold text-white">User Name</Text>
              </View>
              <View className="mt-1.5">
              <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain"/>
              </View>
            </View>
            <SearchInput title="Search" value={""} handleChangeText={(e) => console.log(e)} />
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100 text-lg mb-3">
                  Latest Videos
                </Text>

                <Trending posts={[{id:1},{id:2},{id:3}]}/>
              </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState title="No Videos Found" subtitle="Be the first to create one"/>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;


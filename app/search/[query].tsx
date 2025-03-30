import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "../../theme/theme";
import colors from "tailwindcss/colors";
import { images } from "../../constants";
import SearchInput from "../../comps/SearchInput";
import Trending from "../../comps/Trending";
import EmptyState from "../../comps/EmptyState";
import AlertBox from "../../comps/AlertBox";
import { getAllPosts, searchPosts } from "../../lib/appwrite";
import { getLatestPosts } from "../../lib/appwrite";
import VideoCard from "../../comps/VideoCard";


const Search = () => {
  const {query} = useLocalSearchParams();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useGlobalContext();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await searchPosts(query);
      setData(response);
    } catch (error) {
      showAlert("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data);
  console.log(query);

  useEffect(() => {
    fetchData();
  }, [query]);



  console.log(data);

  const [alert, setAlert] = useState<{
    type: "error" | "success" | "muted" | "warning" | "info";
    message: string;
  } | null>(null);

  const showAlert = (
    type: "error" | "success" | "muted" | "warning" | "info",
    message: string
  ) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.gray[900],
        width: "100%",
        height: "100%",
      }}
      className="min-h-screen max-w-screen-full align-items-center"
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        style={{ gap: 10 }}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-" style={{gap:10}}>
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-sm text-gray-100">Seach Results</Text>

                <Text className="text-2xl font-bold text-gray-100" style={{fontSize:theme.fontSize.xl}}>{query}</Text>
              </View>
              <View className="mt-1.5">
                <TouchableOpacity onPress={() => router.push("/")}>
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <SearchInput
              title="Search"
              value={""}
              handleChangeText={(e) => console.log(e)}
              initialQuery={query}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Create video for this query"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
      {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
    </SafeAreaView>
  );
};

export default Search;

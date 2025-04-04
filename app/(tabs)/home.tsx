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
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { theme } from "../../theme/theme";
import colors from "tailwindcss/colors";
import { images } from "../../constants";
import SearchInput from "../../comps/SearchInput";
import Trending from "../../comps/Trending";
import EmptyState from "../../comps/EmptyState";
import AlertBox from "../../comps/AlertBox";
import { getAllPosts } from "../../lib/appwrite";
import { getLatestPosts } from "../../lib/appwrite";
import VideoCard from "../../comps/VideoCard";


const Home = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<any>([]);

  const { user } = useGlobalContext();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPosts();
      setData(response);
    } catch (error) {
      showAlert("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData2 = async () => {
    setIsLoading(true);
    try {
      const response2 = await getLatestPosts();
      setLatestPosts(response2);
    } catch (error) {
      showAlert("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);

  console.log(user);

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
    fetchData2();
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
                <Text className="text-sm text-gray-100">Welcome Back</Text>

                <Text className="text-2xl font-semibold text-white">
                  {user?.username || "Guest"}
                </Text>
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
            />
            <View style={{ gap: 10, width: "100%", alignItems: "center" }}>
              <Trending posts={latestPosts.length > 0 ? latestPosts : []} />
              <Text style={{ color: "white" }}>Latest Videos</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first to create one"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
      <View style={{ position: "absolute", bottom: 70, width: "100%", alignItems: "center" }}>
      {alert && (
                <AlertBox actionText={alert.type} desc={alert.message} />
              )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
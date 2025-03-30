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
import colors, { white } from "tailwindcss/colors";
import { images, icons } from "../../constants";
import SearchInput from "../../comps/SearchInput";
import Trending from "../../comps/Trending";
import EmptyState from "../../comps/EmptyState";
import AlertBox from "../../comps/AlertBox";
import {
  getAllPosts,
  searchPosts,
  userPosts,
  signOut,
} from "../../lib/appwrite";
import { getLatestPosts } from "../../lib/appwrite";
import VideoCard from "../../comps/VideoCard";
import { account } from "../../lib/appwrite";
import InfoBox from "../../comps/InfoBox";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await userPosts(user.$id);
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

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const user = await account.get().catch(() => null);
      if (!user) {
        showAlert("warning", "No user is signed in");
        setIsLoggedIn(false);
        setTimeout(() => {
          router.replace("/");
        }, 1000);
        return;
      }

      await signOut();
      showAlert("success", "Signed out successfully");
      setIsLoggedIn(false);
      setUser(null);
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong while signing out");
    } finally {
      setIsSigningOut(false);
    }
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
          <View className="my-6 px-4 space-y-" style={{ gap: 10 }}>
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <TouchableOpacity onPress={handleSignOut} style={{ gap: 5 }}>
                  <Image
                    source={icons.logout}
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                  />
                  <Text style={{ fontSize: theme.fontSize.sm, color: white }}>
                    Sign Out
                  </Text>
                </TouchableOpacity>
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

            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 30 / 2,
                borderWidth: 2,
                borderColor: colors.orange[500],
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              
              <InfoBox
                title={user?.username}
                titleStyles={{
                  color: "white",
                  fontSize: theme.fontSize["2xl"],
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
            >
              <InfoBox
                title={data?.length.toString() || 0}
                subtitle="Posts"
                titleStyles={{
                  color: "white",
                  fontSize: theme.fontSize["2xl"],
                }}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Create your first video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          alignItems: "center",
        }}
      >
        {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

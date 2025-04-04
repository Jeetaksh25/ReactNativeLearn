import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { userPosts } from "../../lib/appwrite";
import VideoCard from "@/comps/VideoCard";
import { getUserById } from "../../lib/appwrite";
import { theme } from "../../theme/theme";
import colors from "tailwindcss/colors";
import InfoBox from "@/comps/InfoBox";
import EmptyState from "@/comps/EmptyState";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const [userData,setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const user = await getUserById(id);
      setUserData(user);
      const Posts = await userPosts(id);
      setPosts(Posts);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[900] }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4" style={{ gap: 10, alignItems: "center" }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 30/2,
                borderWidth: 2,
                borderColor: colors.orange[500],
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: userData?.avatar }}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <InfoBox
              title={userData?.username}
              titleStyles={{ color: "white", fontSize: theme.fontSize["2xl"] }}
            />
            <InfoBox
              title={posts?.length.toString() || "0"}
              subtitle="Posts"
              titleStyles={{ color: "white", fontSize: theme.fontSize["2xl"] }}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="This user has not uploaded any videos yet." />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchUserProfile} />}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </SafeAreaView>
  );
};

export default UserProfile;

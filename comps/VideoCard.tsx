import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../theme/theme";
import colors, { gray } from "tailwindcss/colors";
import { icons } from "../constants";
import { Entypo } from "@expo/vector-icons";
import { PlayIcon } from "@/components/ui/icon";
import { Video, ResizeMode } from "expo-av";
import { downloadVideo } from "@/lib/appwrite";
import * as fD from "expo-file-system";

interface Params {
  video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string };
    videoId: string;
  };
}

const VideoCard: React.FC<Params> = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    videoId,
  },
}) => {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const handleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleDownload = async (videoId: string) => {
    try {
      setDownloading(true);
  
      // Assuming downloadVideo returns a URL object, extract the URL string
      const fileUrl = await downloadVideo({ videoId });
  
      // Ensure fileUrl is a string (if it's a URL object, use .toString() to extract the URL)
      const fileUrlString = fileUrl instanceof URL ? fileUrl.toString() : fileUrl;
  
      if (!fileUrlString) {
        throw new Error("File not found");
      }
  
      const fileName = `video_${videoId}.mp4`;
  
      // Create a download resumable object
      const downloadResumable = fD.createDownloadResumable(
        fileUrlString,
        fD.documentDirectory + fileName
      );
  
      // Now use downloadAsync on the downloadResumable object
      const downloadResult = await downloadResumable.downloadAsync();

    if (downloadResult && downloadResult.uri) {
      console.log("Download complete:", downloadResult.uri);
    } else {
      throw new Error("Download failed or returned undefined result");
    }
  
    } catch (error) {
      console.log("Download error:", error);
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  const handleBookmark = () => {
    handleMenu();
  };

  return (
    <View style={styles.CardC}>
      <View style={styles.cardRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.username}>@{username}</Text>
        </View>
        <TouchableOpacity onPress={handleMenu}>
          <Entypo
            name="dots-three-vertical"
            style={{ color: "white", paddingRight: 2 }}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {menuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleDownload(videoId)}
          >
            <Text style={styles.menuText}>{downloading ? "Downloading..." : "Download"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleBookmark}>
            <Text style={styles.menuText}>Bookmark</Text>
          </TouchableOpacity>
        </View>
      )}

      {playing ? (
        <View>
          <Video
            source={{ uri: video }}
            style={styles.videoPlayer}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status && status.isLoaded && status.didJustFinish) {
                setPlaying(false);
              }
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <Image source={icons.play} style={styles.playIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  CardC: {
    width: "100%",
    paddingHorizontal: theme.padding.lg,
    marginVertical: theme.margin.lg,
    gap: theme.gap.xs,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 5,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    borderWidth: 2,
    borderColor: colors.orange[500],
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: theme.fontSize.sm,
    fontWeight: "bold",
  },
  username: {
    color: colors.gray[400],
    fontFamily: "Poppins-Regular",
    fontSize: theme.fontSize.xs,
  },
  thumbnailContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  playIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "black",
    marginTop: 5,
  },
  menuContainer: {
    position: "absolute",
    top: 45,
    right: 30,
    backgroundColor: gray[700],
    padding: 8,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
    gap: 5,
  },
  menuItem: {
    color: "white",
    fontSize: theme.fontSize.sm,
    backgroundColor: gray[900],
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 3,
  },
  menuText: {
    color: "white",
    fontSize: theme.fontSize.sm,
  },
});

export default VideoCard;

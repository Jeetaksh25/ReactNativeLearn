import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform
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
import { useGlobalContext } from "@/context/GlobalProvider";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface Params {
  video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string; $id: string };
    $id: string,
  };
}

const VideoCard: React.FC<Params> = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar, $id },
    $id: videoId
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
      const fileUrl = await downloadVideo({ videoId });

      const fileUrlString =
        fileUrl instanceof URL ? fileUrl.toString() : fileUrl;

      if (!fileUrlString) {
        throw new Error("File not found");
      }

      const fileName = `video_${videoId}.mp4`;
      const tempFilePath = FileSystem.cacheDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrlString,
        tempFilePath
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (downloadResult && downloadResult.uri) {
        console.log("Download complete:", downloadResult.uri);
      } else {
        throw new Error("Download failed or returned undefined result");
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library denied');
      }

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      const album = await MediaLibrary.getAlbumAsync('Download');

      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      console.log("Download complete:", downloadResult.uri);

    } catch (error) {
      console.log("Download error:", error);
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  const handleBookmark = async () => {
    handleMenu();
  };
  
  const handleDelete = async () => {
    handleMenu();
  }

  const { user } = useGlobalContext();

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
            <Text style={styles.menuText}>
              {downloading ? "Downloading..." : "Download"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleBookmark}>
            <Text style={styles.menuText}>Bookmark</Text>
          </TouchableOpacity>
          {$id === user.$id && (
            <TouchableOpacity style={styles.menuItem} onPress={handleBookmark}>
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          )}
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
    textAlign: "center",  
  },
});

export default VideoCard;

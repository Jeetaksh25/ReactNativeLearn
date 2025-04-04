import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_VIDEO_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
  APPWRITE_PLATFORM
} from '@env';

export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: APPWRITE_VIDEO_COLLECTION_ID,
  storageId: APPWRITE_STORAGE_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email.trim(),
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Account not created");
    }

    const avatarURL = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarURL,
      }
    );
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return await getCurrentUser();
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get().catch(() => null);
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  try {
    const session = await account.getSession("current").catch(() => null);
    if (!session) {
      return null;
    }
    await account.deleteSession("current");
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );
    return posts.documents || [];
  } catch (error) {
    throw new Error(error);
    return [];
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents || [];
  } catch (error) {
    return [];
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents || [];
  } catch (error) {
    return [];
  }
};

export const userPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents || [];
  } catch (error) {
    return [];
  }
};

export const deletePost = async (userId, videoId) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );
    if (!post) {
      throw new Error("Post not found.");
    }
    if (post.creator.$id !== userId) {
      throw new Error("You are not authorized to delete this post.");
    }
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );
  } catch (error) {
    throw error;
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("File not found");

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file || !file.uri) {
    throw new Error("Invalid file object: Missing URI.");
  }

  const { mimeType, ...rest } = file;
  const asset = {
    name: file.name,
    type: file.type,
    size: file.size,
    uri: file.uri,
  };

  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadFile.$id, type);

    if (!fileUrl) {
      throw new Error(`Failed to generate preview for file: ${file.name}`);
    }

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const downloadVideo = async (videoId) => {
  try {
    const video = await storage.getFileDownload(
      appwriteConfig.storageId,
      videoId
    );

    return video;
  } catch (error) {
    throw new Error(error);
  }
};

export const checkBookmark = async (userId, videoId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!Array.isArray(user.bookmarks)) return false;

    return user.bookmarks.some((bookmark) => bookmark.$id === videoId);
  } catch (error) {
    throw new Error(error);
  }
};

export const bookmarkVideo = async (userId, videoId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user.bookmarks) user.bookmarks = [];

    if (await checkBookmark(userId, videoId)) {
      return;
    }
    const updatedBookmark = user.bookmarks
      ? [...user.bookmarks, videoId]
      : [videoId];

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        bookmarks: updatedBookmark,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const removeBookmark = async (userId, videoId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user.bookmarks || !Array.isArray(user.bookmarks)) {
      return;
    }

    const updatedBookmarks = user.bookmarks.filter((bookmark) => {
      if (typeof bookmark === "string") {
        return bookmark !== videoId;
      } else if (bookmark && bookmark.$id) {
        return bookmark.$id !== videoId;
      }
      return true;
    });

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { bookmarks: updatedBookmarks }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )
    console.log(user);
    return user;
  } catch (error) {
    throw new Error(error);
  }
}
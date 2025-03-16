import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "67c3805d002d44c8c3b7",
  databaseId: "67c3820800184d63f6fc",
  userCollectionId: "67c3823400203bff209b",
  videoCollectionId: "67c3826c0008c3eeac0e",
  storageId: "67c384030031ca7c0da8",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email.trim(),
      password,
      username
    );

    if (!newAccount) {
      console.log(ID.unique());
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
    console.log(error);
    console.log(ID.unique());
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session Created:", session);
    return session;
  } catch (error) {
    console.log(ID.unique());
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
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.getSession("current").catch(() => null);
    if (!session) {
      console.log("No active session found");
      return null;
    }
    await account.deleteSession("current");
    return null;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getAllPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        )
        return posts.documents || [];

    } catch (error) {
        throw new Error(error);
        return [];
    }
}

export const getLatestPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(7)]
      );
      return posts.documents || [];
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      return [];
    }
  };
  
import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { signOut } from '../../lib/appwrite';
import AlertBox from '../../comps/AlertBox';
import CustomButton from '../../comps/CustomButton';
import { account } from '../../lib/appwrite';
import { router } from 'expo-router';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

const Profile = () => {

  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const { isLoggedIn, setIsLoggedIn, setUser } = useGlobalContext();

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

    const handleSignOut = async () => {
      try {
        setIsSigningOut(true);
    
        const user = await account.get().catch(() => null);
        if (!user) {
          showAlert("warning", "No user is signed in");
          setIsLoggedIn(false);
          setTimeout(()=>{
            router.replace("/");
          },1000)
          return;
        }
    
        await signOut();
        showAlert("success", "Signed out successfully");
        setIsLoggedIn(false);
        setUser(null);
        setTimeout(()=>{
          router.replace("/");
        },1000)

      } catch (error) {
        console.log(error);
        showAlert("error", "Something went wrong while signing out");
      } finally {
        setIsSigningOut(false);
      }
    };
    

  return (
    <View>
      <Text>Profile</Text>
      <CustomButton title="Sign Out" loadingText='Signing Out...' isLoading={isSigningOut} handlePress={handleSignOut}></CustomButton>
      {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
    </View>
  )
}

export default Profile
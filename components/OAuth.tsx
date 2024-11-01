import { Alert, Image, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import { icons } from '@/constants';
import { useOAuth } from '@clerk/clerk-expo';
import { googleOAuth } from '@/lib/auth';
import { router } from 'expo-router';

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);

      if (result.code === 'success' || result.code === 'session_exists') {
        router.replace('/(root)/(tabs)/home');
      }
      Alert.alert(result.success ? 'Success' : 'Error', result.message);
    } catch (err) {
      console.error('OAuth error', err);
    }
  };
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In With Google"
        className="mt-5 w-full shadow-none"
        textClassName="tracking-wider"
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
      />
    </View>
  );
};

export default OAuth;

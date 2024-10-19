import { Alert, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { images, icons } from '@/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputField from '@/components/InputField';
import { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({
        ...verification,
        state: 'pending',
      });
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === 'complete') {
        //TODO: Create a database user!

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({
          ...verification,
          error: 'verification failed',
          state: 'failed',
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: 'failed',
      });
    }
  };
  return (
    <GestureHandlerRootView>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
            <Text className="text-2xl text-black font-JakartaBold absolute bottom-5 left-5">
              Create Your Account
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label="Name"
              placeholder="Enter your name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value: string) =>
                setForm({ ...form, name: value })
              }
              labelStyle={undefined}
              containerStyle={undefined}
              inputStyle={undefined}
              iconStyle={undefined}
              className={undefined}
              iconRight={undefined}
            />
            <InputField
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value: string) =>
                setForm({ ...form, email: value })
              }
              labelStyle={undefined}
              containerStyle={undefined}
              inputStyle={undefined}
              iconStyle={undefined}
              className={undefined}
              iconRight={undefined}
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value: string) =>
                setForm({ ...form, password: value })
              }
              iconRight={icons.eyecross}
              labelStyle={undefined}
              containerStyle={undefined}
              inputStyle={undefined}
              iconStyle={undefined}
              className={undefined}
            />

            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6"
            />

            <OAuth />

            <Link
              href="/sign-in"
              className="mt-10 mb-16 text-lg text-center text-general-200"
            >
              <Text>Already have an account? </Text>
              <Text className="text-primary-500">Sign In</Text>
            </Link>
          </View>
        </View>
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() => {
            if (verification.state === 'success') setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              labelStyle="font-JakartaExtraBold"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code: code })
              }
            />

            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}

            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center">
              You have successfully Verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push('./(root)/(tabs)/home');
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SignUp;

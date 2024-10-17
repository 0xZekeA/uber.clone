import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { images, icons } from '@/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputField from '@/components/InputField';
import { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { Link } from 'expo-router';
import OAuth from '@/components/OAuth';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onSignInPress = async () => {};

  return (
    <GestureHandlerRootView>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
            <Text className="text-2xl text-black font-JakartaBold absolute bottom-5 left-5">
              Welcome👋
            </Text>
          </View>
          <View className="p-5">
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
              title="Sign In"
              onPress={onSignInPress}
              className="mt-6"
            />

            <OAuth />

            <Link
              href="/sign-up"
              className="mt-10 mb-12 text-lg text-center text-general-200"
            >
              <Text>Don't have an account? </Text>
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SignIn;

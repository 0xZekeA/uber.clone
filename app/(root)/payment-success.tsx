import { Image, Text, View } from 'react-native';
import RideLayout from '@/components/RideLayout';
import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const PaymentSuccess = () => {
  return (
    <>
      <RideLayout title="Choose a Rider">
        <View className="min-h-[540px] rounded-2xl bg-white px-7 py-9">
          <Image
            source={images.check}
            className="w-[110px] h-[110px] mx-auto my-5"
          />
          <Text className="text-3xl font-JakartaBold text-center">
            Booking placed successful
          </Text>
          <Text className="text-base text-gray-400 font-Jakarta text-center">
            Thank you for your booking! Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>
          <CustomButton
            title="Go Track"
            onPress={() => {
              router.push('/(root)/track');
            }}
            className="mt-5"
          />
          <CustomButton
            title="Back Home"
            onPress={() => {
              router.push('/(root)/(tabs)/home');
            }}
            className="mt-3 mb-5"
            bgVariant="secondary"
            textVariant="primary"
          />
        </View>
      </RideLayout>
    </>
  );
};

export default PaymentSuccess;

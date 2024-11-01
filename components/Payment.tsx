import CustomButton from './CustomButton';
import { useLocationStore } from '@/store';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Image, TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import ReactNativeModal from 'react-native-modal';
import { images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { PaymentProps } from '@/types/type';

const Payment: React.FC<PaymentProps> = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}) => {
  const { user } = useUser();
  const { userId } = useAuth();
  const [success, setSuccess] = useState(false);
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [emailAddress, setEmailAddress] = useState(email || '');
  const [name, setName] = useState(fullName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const flutterwavePublicKey =
    'FLWPUBK_TEST-c3462519f68fd2b3d830962efbfa0ae5-X';

  const generateTxRef = (): string => 'tx-' + uuidv4();

  const handleOnRedirect = async (data: { status: string; tx_ref: string }) => {
    console.log(data);
    try {
      const response = await fetch(
        'https://5992-197-210-79-75.ngrok-free.app/api/transaction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            txRef: data.tx_ref,
            amount: amount,
            status: data.status,
            userId: user?.id,
          }),
        }
      );

      const result = await response.json();
      await fetchAPI('/(api)/ride/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: rideTime.toFixed(0),
          fare_price: parseInt(amount) * 100,
          payment_status: 'paid',
          driver_id: driverId,
          user_id: userId,
        }),
      });
      console.log(result);
      if (response.ok) {
        console.log('Transaction successfully registered:', result);
        setSuccess(true);
      } else {
        console.error('Error registering transaction:', result.message);
      }
    } catch (error) {
      console.error('Error sending transaction data:', error);
    }
  };

  return (
    <>
      {!isConfirmed ? (
        <CustomButton
          title="Confirm Ride"
          className="my-10"
          onPress={() => setIsConfirmed(true)}
        />
      ) : null}
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
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
              setSuccess(false);
            }}
            className="mt-5"
          />
          <CustomButton
            title="Back Home"
            onPress={() => {
              router.push('/(root)/(tabs)/home');
              setSuccess(false);
            }}
            className="mt-3 mb-5"
            bgVariant="outline"
            textVariant="primary"
          />
        </View>
      </ReactNativeModal>
      {isConfirmed ? (
        <View className="mt-20 mb-96">
          <Text className="text-2xl mb-8 text-center font-semibold">
            Payment Details
          </Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="border border-gray-300 rounded-lg p-3 mb-6 w-full"
          />

          <TextInput
            placeholder="Email Address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            className="border border-gray-300 rounded-lg p-3 mb-6 w-full"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="border border-gray-300 rounded-lg p-3 mb-11 w-full"
            keyboardType="phone-pad"
          />

          <Text className="text-lg mb-4">Amount to Pay: ₦{Number(amount)}</Text>
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTxRef(),
              authorization: flutterwavePublicKey,
              customer: {
                email: email,
                phonenumber: phoneNumber,
              },
              amount: Number(Number(amount)),
              currency: 'NGN',
              payment_options: 'card, banktransfer',
            }}
          />
        </View>
      ) : null}
    </>
  );
};

export default Payment;

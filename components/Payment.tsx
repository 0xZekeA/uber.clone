import CustomButton from './CustomButton';
import { useDriverStore } from '@/store';
import { useUser } from '@clerk/clerk-expo';
import { TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { PayWithFlutterwave } from 'flutterwave-react-native';

interface PaymentProps {
  routeLink: string;
}

const Payment: React.FC<PaymentProps> = ({ routeLink }) => {
  const { drivers, selectedDriver } = useDriverStore();
  const { user } = useUser();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [email, setEmail] = useState(
    user?.emailAddresses[0].emailAddress || ''
  );
  const [name, setName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const flutterwavePublicKey =
    'FLWPUBK_TEST-c3462519f68fd2b3d830962efbfa0ae5-X';

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver
  )[0];

  const [amount, setAmount] = useState(Number(driverDetails?.price) || 15000);

  const generateTxRef = (): string => 'tx-' + uuidv4();

  const handleOnRedirect = async (data: { status: string; tx_ref: string }) => {
    console.log(data);
    try {
      const response = await fetch(
        'https://b342-102-90-46-206.ngrok-free.app/api/transaction',
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
      console.log(result);
      if (response.ok) {
        console.log('Transaction successfully registered:', result);
        router.push(routeLink);
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
            value={email}
            onChangeText={setEmail}
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

          <Text className="text-lg mb-4">Amount to Pay: ₦{amount}</Text>
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTxRef(),
              authorization: flutterwavePublicKey,
              customer: {
                email: email,
                phonenumber: phoneNumber,
              },
              amount: amount,
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

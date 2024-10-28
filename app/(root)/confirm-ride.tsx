import CustomButton from '@/components/CustomButton';
import DriverCard from '@/components/DriverCard';
import RideLayout from '@/components/RideLayout';
import { drivers } from '@/constants/Drivers';
import { useDriverStore } from '@/store';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

const ConfirmRide = () => {
  const [isSelected, setIsSelected] = useState(false);
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RideLayout title="Choose a Driver" snapPoints={['65%', '85%']}>
      <FlatList
        data={drivers}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => {
              setSelectedDriver(Number(item.id)!);
              setIsSelected(true);
            }}
          />
        )}
        ListFooterComponent={() =>
          isSelected ? (
            <View className="mx-5 mt-10">
              <CustomButton
                title="Select Ride"
                onPress={() => router.push('/(root)/book-ride')}
              />
            </View>
          ) : null
        }
      />
    </RideLayout>
  );
};

export default ConfirmRide;

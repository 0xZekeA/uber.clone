import { calculateRegion, generateMarkersFromData } from '@/lib/map';
import { useDriverStore, useLocationStore } from '@/store';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { drivers } from '@/constants/Drivers';
import { useEffect, useState } from 'react';
import { MarkerData } from '@/types/type';
import { icons } from '@/constants';

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    } else {
    }
  }, [drivers]);

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
          />
        );
      })}
    </MapView>
  );
};

export default Map;

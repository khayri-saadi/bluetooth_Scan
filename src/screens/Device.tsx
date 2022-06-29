import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, ScrollView, Button, View, StyleSheet } from 'react-native';
import { Service } from 'react-native-ble-plx';
import { ServiceCard } from '../components/ServiceCard';
import { RootStackParamList } from '../navigation/index';

const DeviceScreen = ({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, 'Device'>) => {
  // get the device object which was given through navigation params
  const { device } = route.params;

  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [OneService, setOneservice] = useState({})

  // handle the device disconnection
  const disconnectDevice = useCallback(async () => {
    navigation.goBack();
    const isDeviceConnected = await device.isConnected();
    if (isDeviceConnected) {
      await device.cancelConnection();
    }
  }, [device, navigation]);

  useEffect(() => {
    const getDeviceInformations = async () => {
      // connect to the device
      const connectedDevice = await device.connect();
      setIsConnected(true);
      // discover all device services and characteristics
      const allServicesAndCharacteristics = await connectedDevice.discoverAllServicesAndCharacteristics();
      //console.log(allServicesAndCharacteristics,'alll servicess')
      // get the services only
      const discoveredServices = await allServicesAndCharacteristics.services();
     // console.log('servicesss')
      //console.log(discoveredServices[3].uuid)
     const  correctUIID =  await  discoveredServices[3]
     setOneservice(correctUIID)
      setServices(discoveredServices);

      //console.log(correctUIID,'correctUUID')

    };

    getDeviceInformations();

    device.onDisconnected(() => {
      navigation.navigate('Home');
    });

    // give a callback to the useEffect to disconnect the device when we will leave the device screen
    return () => {
      disconnectDevice();
    };
  }, [device, disconnectDevice, navigation]);
  // console.log(OneService,'111111')
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{display:'none'}}>
           <ServiceCard service={OneService} />
      </View>
          <Button  title="disconnect" onPress={disconnectDevice} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },

  header: {
    backgroundColor: 'teal',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { DeviceScreen };

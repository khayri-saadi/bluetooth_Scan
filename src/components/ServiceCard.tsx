import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Characteristic, Descriptor, Service } from 'react-native-ble-plx';
import { CharacteristicCard } from './CharacteristicCard';
import { DescriptorCard } from './DescriptorCard';

type ServiceCardProps = {
  service: Service;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UART_SERVICE_UUID = '6E400001-B5A3-F393-­E0A9-­E50E24DCCA9E'.toLowerCase();

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
 const [Onecharacteristic, setOnecharacteristic] = useState({})
  const [areCharacteristicsVisible, setAreCharacteristicsVisible] = useState(
    false,
  );

  useEffect(() => {
    const getCharacteristics = async () => {
      const newCharacteristics = await service.characteristics();
     //setOnecharacteristic(newCharacteristics[3])
      setCharacteristics(newCharacteristics);
    console.log()
      console.log(newCharacteristics.length)
     // console.log('coreactCharrrrrrrr')
      //console.log(newCharacteristics[3],'333333')
      setOnecharacteristic(newCharacteristics[3])
      newCharacteristics.forEach(async (characteristic) => {
        console.log(characteristic.uuid)
        const newDescriptors = await characteristic.descriptors();
        setDescriptors((prev) => [...new Set([...prev, ...newDescriptors])]);
      });
    };

    getCharacteristics();
  }, [service]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setAreCharacteristicsVisible((prev) => !prev);
        }}>
        <Text>{`UUID : ${service.uuid}`}</Text>
      </TouchableOpacity>
      {
       characteristics &&
        characteristics.map((char) => (
          (char.uuid ==='cdeacb81-5235-4c07-8846-93a37ee6b86d') ?
          <CharacteristicCard key={char.id} char={char} /> : 
          null
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { ServiceCard };
